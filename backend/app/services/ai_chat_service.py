import json
import logging
import re
from typing import Any

try:
    from openai import AsyncOpenAI
except ModuleNotFoundError:  # pragma: no cover
    AsyncOpenAI = None

try:
    import boto3
except ModuleNotFoundError:
    boto3 = None

from app.core.config import settings
from app.services.intake_gate import (
    assistant_message_count,
    evaluate_intake,
    follow_up_incomplete_message,
    initial_welcome_message,
    normalize_ui_language,
)
from app.services.qdrant_rag import _retrieve_reference_context, retrieve_reference_context_async
from app.services.reference_fallback import expand_query_tokens as _expand_query_tokens

logger = logging.getLogger(__name__)

# Low temperatures sound stiff; ~0.5 keeps dosing discipline in the prompt while wording stays natural.
_CHAT_TEMPERATURE = 0.6

_SEVERITY_ANY = re.compile(r"\[SEVERITY:\s*(low|moderate|critical)\s*\]", re.I)


def _parse_severity(raw: str) -> tuple[str, str]:
    if not raw:
        return "", "low"
    text = raw.strip()
    matches = list(_SEVERITY_ANY.finditer(text))
    if not matches:
        return text, "low"
    last = matches[-1]
    severity = last.group(1).lower()
    clean = (text[: last.start()] + text[last.end() :]).strip()
    return clean, severity


def _medication_rules_hindi() -> str:
    return """
VOICE AND TONE (read carefully):
- You are Gopu: sound like a calm, experienced veterinarian explaining to a worried owner — warm, respectful, and clear, not like a chatbot or a form.
- Start with brief empathy when the owner sounds stressed; then give practical, ordered guidance (what to watch, what helps, what would warrant urgent help).
- Avoid corporate filler ("I'd be happy to help", "Great question"). Avoid lecturing; sound human and steady.

KNOWLEDGE AND ADVICE POLICY:
- Give useful first aid, husbandry, and disease-awareness guidance from your training and the references below.
- Do not brush people off with empty "I don't know" answers when you can share safe general information.
- When signs are serious, unclear, or could worsen quickly, say honestly that a hands-on vet exam is needed — that is part of good veterinary judgement, not fear-mongering.

DOMAIN BOUNDARY — STRICT RULE:
- You are a Veterinary Assistant. You MUST ONLY answer questions related to animals, pets, livestock, animal husbandry, and veterinary medicine.
- If a user asks about ANY other topic, politely refuse in simple Hindi: you only help with animal and pet health.

MEDICATION DOSAGE — STRICT RULES:
- You are given RETRIEVED REFERENCE CHUNKS for each request.
- You MAY suggest medicine names based on your training or the reference chunks.
- International drug names may appear in Latin letters when needed; keep explanations in simple Hindi (Devanagari).
- For exact DOSAGES (min/max dose, route, frequency), you MUST ONLY use information from the RETRIEVED REFERENCE CHUNKS.
- Never use memory or guesswork for dosages.
- If the user explicitly asks for a dosage and it is NOT in the RETRIEVED REFERENCE CHUNKS, say you do not have the exact dosage from references.
- After any medication mention, add this disclaimer (Hindi):
  "सही खुराक और तरीका केवल एक प्रमाणित पशु चिकित्सक ही बता सकता है।"

SEVERITY TAGGING — MANDATORY:
At the very end of EVERY response, append exactly one tag on its own line:
  [SEVERITY: low]      — general query, minor issue, routine care
  [SEVERITY: moderate] — concerning symptoms, needs vet attention soon
  [SEVERITY: critical] — emergency, life-threatening, needs immediate vet
If unsure, default to [SEVERITY: low].
"""


def _medication_rules_english() -> str:
    return """
VOICE AND TONE (read carefully):
- You are Gopu: sound like a calm, experienced veterinarian talking to a concerned owner — warm, direct, and professional, not like generic AI small-talk.
- When someone is worried, acknowledge it briefly, then give clear, ordered guidance (what to monitor, supportive care, red flags for urgent care).
- Avoid corporate filler ("Happy to help", "Great question"). Avoid jargon dumps; explain simply unless the user clearly wants technical detail.

KNOWLEDGE AND ADVICE POLICY:
- Give useful first aid, husbandry, and disease-awareness guidance from your training and the references below.
- Do not default to empty "I don't know" when you can share safe, general information.
- When signs are serious, ambiguous, or could worsen quickly, say clearly that an in-person vet exam is needed — that is sound clinical judgement.

DOMAIN BOUNDARY — STRICT RULE:
- You are a Veterinary Assistant. You MUST ONLY answer questions related to animals, pets, livestock, animal husbandry, and veterinary medicine.
- If a user asks about ANY other topic, politely refuse and say you only help with animal and pet health.

MEDICATION DOSAGE — STRICT RULES:
- You are given RETRIEVED REFERENCE CHUNKS for each request.
- You MAY suggest medicine names based on your training or the reference chunks.
- For exact DOSAGES (min/max dose, route, frequency), you MUST ONLY use information from the RETRIEVED REFERENCE CHUNKS.
- Never use memory or guesswork for dosages.
- If the user explicitly asks for a dosage and it is NOT in the RETRIEVED REFERENCE CHUNKS, say you do not have the exact dosage from references.
- After any medication mention, add this disclaimer (English):
  "Exact dose and route must be confirmed by a licensed veterinarian."

SEVERITY TAGGING — MANDATORY:
At the very end of EVERY response, append exactly one tag on its own line:
  [SEVERITY: low]      — general query, minor issue, routine care
  [SEVERITY: moderate] — concerning symptoms, needs vet attention soon
  [SEVERITY: critical] — emergency, life-threatening, needs immediate vet
If unsure, default to [SEVERITY: low].
"""


class AIChatService:
    def __init__(self):
        if AsyncOpenAI is None:
            logger.warning("openai package is not installed.")
            self.openai_client = None
        else:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        if boto3 is None:
            logger.warning("boto3 package is not installed.")
            self.sagemaker_client = None
        else:
            try:
                self.sagemaker_client = boto3.client(
                    service_name="sagemaker-runtime",
                    region_name=settings.AWS_REGION,
                )
            except Exception as e:
                logger.error(f"Failed to initialize SageMaker client: {e}")
                self.sagemaker_client = None

        med_hi = _medication_rules_hindi()
        med_en = _medication_rules_english()

        self.prompts = {
            "Hindi": f"""
आप पाशुवाणी (PashuVaani) के गोपु (Gopu) हैं — एक पशु स्वास्थ्य सहायक जो अनुभवी पशु चिकित्सक जैसा सोचता है: भरोसेमंद, संतुलित, और मालिक के प्रति सम्मानजनक।
आपका उद्देश्य भारतीय पालतू और पशुपालकों को साफ़, व्यावहारिक और सही दिशा देना है (न कि घबराहट बढ़ाना)।

भाषा (STRICT LANGUAGE RULE):
- मुख्य जवाब सरल हिंदी (देवनागरी) में दें।
- अंतर्राष्ट्रीय दवा नाम लैटिन वर्णों में रख सकते हैं (जैसे Amoxicillin, Florfenicol); व्याख्या हिंदी में रखें।
- हिंग्लिश वाक्यों से बचें; सामान्य शब्द हिंदी में लिखें (बुखार, दस्त, पशु चिकित्सक, खुराक)।

मुख्य सिद्धांत:
1. 'पशु भी परिवार है' — गर्मजोशी रखें, लेकिन भाषा विनम्र और पेशेवर रहे (बच्चों को संबोधित करने जैसा नहीं)।
2. जहाँ ज़रूरी हो वहाँ एक-दो सही चिकित्सा शब्द ठीक हैं; बिना ज़रूरत के शब्दजाल न दें।
3. **सत्यता**: खुराक/मार्ग/आवृत्ति के लिए केवल नीचे दिए संदर्भ खंडों का उपयोग करें; बाकी में सामान्य और सुरक्षित जानकारी दें।
4. **क्षेत्र**: केवल जानवरों से जुड़े प्रश्न।

संरचना (जवाब कैसे दें):
- गंभीरता के अनुसार पहले संक्षेप में स्थिति समझें, फिर क्या करें / क्या न देखें, और कब तुरंत डॉक्टर से संपर्क करें — यह क्रम पशु चिकित्सक जैसा लगता है।

सुरक्षा:
- स्पष्ट आपात या जानलेवा लक्षण पर तुरंत नज़दीकी पशु चिकित्सक/क्लिनिक की सलाह दें।
- अगर जानकारी अधूरी लगे तो एक-दो स्पष्ट सवाल पूछें; अनावश्यक रूप से क्लिनिक न भेजें, पर गंभीर/अस्पष्ट लक्षण पर परीक्षण की ज़रूरत ईमानदारी से कहें।

लंबाई:
- अधिकतम लगभग 3–5 छोटे वाक्य, या ज़रूरत हो तो संक्षिप्त बिंदु; लंबा भाषण नहीं।
{med_hi}""",
            "English": f"""
You are Gopu for PashuVaani — an animal health assistant that thinks like a seasoned veterinarian: trustworthy, balanced, and respectful toward owners.
Your purpose is to give Indian pet and livestock keepers clear, practical direction (not to increase anxiety).

STRICT LANGUAGE RULE:
- Respond ONLY in clear, simple English.
- Do not use Hindi, Hinglish, or other languages in the answer.

CORE PRINCIPLES:
1. "Animals are family" — be warm but professional (not patronising).
2. Use plain language; introduce a clinical term only when it helps clarity, then explain it briefly.
3. **GROUNDEDNESS**: For exact doses, routes, and frequencies, use ONLY the RETRIEVED REFERENCE CHUNKS below; for everything else, give safe general guidance.
4. **DOMAIN**: Only animal-related questions.

STRUCTURE:
- Briefly acknowledge the situation, then what to do / what to avoid, and when to seek urgent in-person care — this reads like good vet communication.

SAFETY:
- For clear emergencies or life-threatening signs, tell them to contact a vet or emergency clinic immediately.
- If information is thin, ask one or two focused questions; do not send people to the clinic unnecessarily, but be honest when an exam is needed.

LENGTH:
- About 3–5 short sentences, or tight bullet points if needed — no long essays.
{med_en}""",
        }

    async def _call_medgemma_sagemaker(self, prompt: str) -> str:
        if not self.sagemaker_client:
            raise RuntimeError("SageMaker client not initialized")

        full_prompt = f"<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n"

        payload = {
            "inputs": full_prompt,
            "parameters": {
                "max_new_tokens": 512,
                "temperature": _CHAT_TEMPERATURE,
                "top_p": 0.9,
            },
        }

        response = self.sagemaker_client.invoke_endpoint(
            EndpointName=settings.SAGEMAKER_ENDPOINT_NAME,
            ContentType="application/json",
            Body=json.dumps(payload),
        )

        result = json.loads(response["Body"].read().decode())

        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "")
        if isinstance(result, dict):
            return result.get("generated_text", "")
        return str(result)

    async def get_response(
        self,
        user_message: str,
        image_base64: str | None = None,
        chat_history: list | None = None,
        language: str = "Hindi",
    ) -> dict[str, Any]:
        """Get an AI response maintaining context from history. Uses MedGemma with OpenAI fallback."""
        try:
            intake = evaluate_intake(user_message or "", chat_history)
            lang_key = normalize_ui_language(language)
            if not intake.emergency and not intake.intake_complete:
                if assistant_message_count(chat_history) == 0:
                    msg = initial_welcome_message(lang_key)
                else:
                    msg = follow_up_incomplete_message(lang_key)
                return {"response": msg, "severity": "low"}

            base_prompt = self.prompts.get(lang_key, self.prompts["English"])
            retrieved_context = await retrieve_reference_context_async(
                user_message or "",
                self.openai_client,
                top_k=settings.RAG_TOP_K,
            )
            selected_prompt = (
                f"{base_prompt}\n\n"
                "RETRIEVED REFERENCE CHUNKS (HYBRID QDRANT RAG — dosage facts must match these chunks):\n"
                f"{retrieved_context}\n"
            )

            if settings.USE_MEDGEMMA and self.sagemaker_client:
                try:
                    logger.info(
                        f"Attempting response using MedGemma (Endpoint: {settings.SAGEMAKER_ENDPOINT_NAME})"
                    )
                    history_text = ""
                    if chat_history:
                        for msg in chat_history:
                            history_text += f"{msg.role}: {msg.content}\n"

                    full_med_prompt = (
                        f"{selected_prompt}\n\nChat History:\n{history_text}\nUser: {user_message}"
                    )
                    raw_response = await self._call_medgemma_sagemaker(full_med_prompt)

                    if raw_response:
                        clean_response, severity = _parse_severity(raw_response)
                        return {"response": clean_response, "severity": severity}
                except Exception as med_err:
                    logger.warning(f"MedGemma (SageMaker) failed, falling back to OpenAI: {med_err}")

            if not self.openai_client:
                raise RuntimeError("OpenAI client not initialized and MedGemma failed.")

            logger.info("Using OpenAI (gpt-4o-mini)")
            messages: list[dict[str, Any]] = [{"role": "system", "content": selected_prompt}]
            if chat_history:
                for msg in chat_history:
                    messages.append({"role": msg.role, "content": msg.content})

            content_payload: list[dict[str, Any]] = [{"type": "text", "text": user_message or ""}]
            if image_base64:
                prefix = (
                    "" if image_base64.startswith("data:image") else "data:image/jpeg;base64,"
                )
                content_payload.append(
                    {"type": "image_url", "image_url": {"url": f"{prefix}{image_base64}"}}
                )

            messages.append({"role": "user", "content": content_payload})

            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=400,
                temperature=_CHAT_TEMPERATURE,
            )

            raw_response = response.choices[0].message.content or ""
            clean_response, severity = _parse_severity(raw_response)
            return {"response": clean_response, "severity": severity}

        except Exception as e:
            logger.error(f"AI Chat Error: {e}")
            raise Exception("Our AI expert is currently unavailable. Please try again later.") from e


ai_chat_service_impl = AIChatService()
