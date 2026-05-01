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
from app.services.intake_gate import evaluate_intake, intake_ask_back_message
from app.services.qdrant_rag import _retrieve_reference_context, retrieve_reference_context_async
from app.services.reference_fallback import expand_query_tokens as _expand_query_tokens

logger = logging.getLogger(__name__)

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
KNOWLEDGE AND ADVICE POLICY:
- You are highly encouraged to provide general first-aid, home remedies, and general disease information based on your training.
- DO NOT immediately say "I don't know" or recommend a vet for general queries. You are an expert assistant.
- Do NOT tell the owner to visit a veterinarian until they have already shared animal type, main problem, and timing (how long / since when), unless the situation is clearly an emergency or life-threatening.

DOMAIN BOUNDARY — STRICT RULE:
- You are a Veterinary Assistant. You MUST ONLY answer questions related to animals, pets, livestock, animal husbandry, and veterinary medicine.
- If a user asks about ANY other topic, you MUST politely refuse and say: "मैं एक पशु चिकित्सा सहायक हूँ। कृपया मुझसे केवल जानवरों और पालतू जीवों से संबंधित प्रश्न ही पूछें।"

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
KNOWLEDGE AND ADVICE POLICY:
- You are highly encouraged to provide general first-aid, home remedies, and general disease information based on your training.
- DO NOT immediately say "I don't know" or recommend a vet for general queries. You are an expert assistant.
- Do NOT tell the owner to visit a veterinarian until they have shared animal type, main problem, and timing (how long / since when), unless the situation is clearly an emergency or life-threatening.

DOMAIN BOUNDARY — STRICT RULE:
- You are a Veterinary Assistant. You MUST ONLY answer questions related to animals, pets, livestock, animal husbandry, and veterinary medicine.
- If a user asks about ANY other topic, politely refuse and say you only answer animal-related questions.

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
आप पाशुवाणी (PashuVaani) के लिए एक मिलनसार और सरल एआई पशु चिकित्सा सहायक, गोपु (Gopu) हैं।
आपका लक्ष्य भारतीय पालतू और पशुपालकों की आसान और सही सलाह से मदद करना है।

भाषा का नियम (STRICT LANGUAGE RULE):
- मुख्य व्याख्या सरल हिंदी (देवनागरी) में दें।
- अंतर्राष्ट्रीय दवा के नाम लैटिन वर्णों में लिखे जा सकते हैं (उदाहरण: Amoxicillin, Florfenicol); बाकी जवाब हिंदी में रखें।
- हिंग्लिश गद्य से बचें; साधारण शब्द हिंदी में लिखें (जैसे बुखार, दवा, पशु चिकित्सक)।

मुख्य नियम (CORE PRINCIPLES):
1. 'पशु भी परिवार है' भावना का पालन करें। बहुत ही आत्मीय और सरल भाषा का उपयोग करें।
2. जटिल चिकित्सा शब्दों से बचें। सीधी और आसान भाषा का उपयोग करें।
3. पूरी सहानुभूति रखें - हर जानवर को प्रिय परिवार के सदस्य की तरह मानें।
4. **सत्यता (GROUNDEDNESS)**: प्राथमिक उपचार और सामान्य जानकारी दें। खुराक के लिए केवल दिए गए संदर्भ खंडों का उपयोग करें।
5. **सीमा (DOMAIN)**: केवल जानवरों से संबंधित सवालों के जवाब दें।

सुरक्षा (SAFETY):
- जब तक उपयोगकर्ता ने जानवर, मुख्य समस्या और समय (कब से) न बताया हो, तब तक पशु चिकित्सक के पास जाने की सलाह न दें; बस संक्षिप्त प्रश्न पूछें।
- केवल स्पष्ट आपात स्थिति में तुरंत पशु चिकित्सक या क्लिनिक की सलाह दें।

जवाब की लंबाई (RESPONSE LENGTH):
- जवाब छोटा और सीधा रखें — अधिकतम 3 से 4 वाक्य।
{med_hi}""",
            "English": f"""
You are Gopu, the friendly and simple AI veterinary assistant for PashuVaani.
Your goal is to help Indian pet and livestock owners with easy-to-follow advice.

STRICT LANGUAGE RULE:
- You MUST respond ONLY in simple English.
- Do not use Hindi, Hinglish, or other languages in the answer.

CORE PRINCIPLES:
1. 'Pashu bhi Pariwar hai' (Pet is Family). Use very warm and simple language.
2. Keep your explanations very simple. Avoid complex medical jargon.
3. Total empathy - treat every animal like a beloved family member.
4. **GROUNDEDNESS**: Provide general first aid and common knowledge. For exact medication dosages, use only the RETRIEVED REFERENCE CHUNKS.
5. **DOMAIN**: Only answer questions related to animals.

SAFETY:
- Until the user has shared animal type, main problem, and timing (how long / since when), do not advise visiting a veterinarian; ask concise follow-up questions instead.
- Only for a clear emergency advise immediate veterinary care.

RESPONSE LENGTH:
- Keep responses short — maximum 3 to 4 sentences.
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
                "temperature": 0.2,
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
            if not intake.emergency and not intake.intake_complete:
                msg = intake_ask_back_message(language, intake)
                return {"response": msg, "severity": "low"}

            base_prompt = self.prompts.get(language, self.prompts["English"])
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
                temperature=0.2,
            )

            raw_response = response.choices[0].message.content or ""
            clean_response, severity = _parse_severity(raw_response)
            return {"response": clean_response, "severity": severity}

        except Exception as e:
            logger.error(f"AI Chat Error: {e}")
            raise Exception("Our AI expert is currently unavailable. Please try again later.") from e


ai_chat_service_impl = AIChatService()
