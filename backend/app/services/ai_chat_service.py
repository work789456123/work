import json
import logging
import os
import re
import math
from collections import Counter
from functools import lru_cache
from typing import Any
from difflib import get_close_matches

try:
    from openai import AsyncOpenAI
except ModuleNotFoundError:  # pragma: no cover
    AsyncOpenAI = None

try:
    import boto3
except ModuleNotFoundError:
    boto3 = None

from app.core.config import settings

logger = logging.getLogger(__name__)

# ... (Previous RAG logic remains unchanged) ...

# ---------------------------------------------------------------------------
# AI Chat Service
# ---------------------------------------------------------------------------

class AIChatService:
    def __init__(self):
        # OpenAI Client
        if AsyncOpenAI is None:
            logger.warning("openai package is not installed.")
            self.openai_client = None
        else:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        # SageMaker Client
        if boto3 is None:
            logger.warning("boto3 package is not installed.")
            self.sagemaker_client = None
        else:
            try:
                self.sagemaker_client = boto3.client(
                    service_name="sagemaker-runtime",
                    region_name=settings.AWS_REGION
                )
            except Exception as e:
                logger.error(f"Failed to initialize SageMaker client: {e}")
                self.sagemaker_client = None

        self.medication_rules = """
KNOWLEDGE AND ADVICE POLICY:
- You are highly encouraged to provide general first-aid, home remedies, and general disease information based on your training.
- DO NOT immediately say "I don't know" or recommend a vet for general queries. You are an expert assistant.
- ONLY recommend seeing a vet if the situation is critical, life-threatening, or requires a physical procedure. Do NOT recommend a vet for basic questions.

MEDICATION DOSAGE — STRICT RULES:
- You are given RETRIEVED REFERENCE CHUNKS for each request.
- You MAY suggest medicine names based on your training or the reference chunks.
- However, for exact DOSAGES (min/max dose, route, frequency), you MUST ONLY use information from the RETRIEVED REFERENCE CHUNKS.
- Never use memory or guesswork for dosages.
- If the user explicitly asks for a dosage and it is NOT in the RETRIEVED REFERENCE CHUNKS, you may say you don't know the exact dosage.
- Always add this disclaimer after any medication mention:
  "सही खुराक और तरीका केवल एक प्रमाणित पशु चिकित्सक ही बता सकता है।"

SEVERITY TAGGING — MANDATORY:
At the very end of EVERY response, append exactly one tag on its own line:
  [SEVERITY: low]      — general query, minor issue, routine care
  [SEVERITY: moderate] — concerning symptoms, needs vet attention soon
  [SEVERITY: critical] — emergency, life-threatening, needs immediate vet
If unsure, default to [SEVERITY: moderate].
"""

        self.prompts = {
            "Hindi": f"""
आप पाशुवाणी (PashuVaani) के लिए एक मिलनसार और सरल एआई पशु चिकित्सा सहायक, गोपु (Gopu) हैं।
आपका लक्ष्य भारतीय पालतू और पशुपालकों की आसान और सही सलाह से मदद करना है।

भाषा का नियम (STRICT LANGUAGE RULE):
- आपको हमेशा सिर्फ और सिर्फ सरल हिंदी (देवनागरी लिपि) में जवाब देना है।
- **हिंग्लिश (Hinglish) या अंग्रेजी अक्षरों का इस्तेमाल बिल्कुल न करें।**
- यहाँ तक कि 'Doctor', 'Medicine', 'Fever' जैसे शब्दों को भी हिंदी में लिखें (डॉक्टर, दवाई, बुखार)।
- कोष्ठक (brackets) में भी अंग्रेजी शब्द न लिखें।

मुख्य नियम (CORE PRINCIPLES):
1. 'पशु भी परिवार है' भावना का पालन करें। बहुत ही आत्मीय और सरल भाषा का उपयोग करें।
2. जटिल चिकित्सा शब्दों से बचें। सीधी और आसान भाषा का उपयोग करें।
3. पूरी सहानुभूति रखें - हर जानवर को प्रिय परिवार के सदस्य की तरह मानें।
4. **सत्यता (GROUNDEDNESS)**: प्राथमिक उपचार (First Aid) और सामान्य जानकारी बेझिझक दें। केवल दवाइयों की सटीक खुराक के लिए दिए गए नियमों का पालन करें। हर छोटी बात पर डॉक्टर के पास जाने की सलाह न दें, केवल गंभीर स्थिति में ही डॉक्टर की सलाह दें।

सुरक्षा (SAFETY):
- यदि जानवर की स्थिति बहुत खराब है, तभी तुरंत डॉक्टर को दिखाने की सलाह दें।

जवाब की लंबाई (RESPONSE LENGTH):
- जवाब छोटा और सीधा रखें — अधिकतम 3 से 4 वाक्य।
- लंबी व्याख्या से बचें। सिर्फ जरूरी जानकारी दें।
{self.medication_rules}""",

            "English": f"""
You are Gopu (गोपु), the friendly and simple AI veterinary assistant for PashuVaani.
Your goal is to help Indian pet and livestock owners with easy-to-follow advice.

STRICT LANGUAGE RULE:
- You MUST strictly respond ONLY in simple English.
- **Do not use Hindi, Hinglish, or any other languages.**
- Do not use Hindi words in parenthesis. Keep the entire response in English.

CORE PRINCIPLES:
1. 'Pashu bhi Pariwar hai' (Pet is Family). Use very warm and simple language.
2. Keep your explanations very simple. Avoid complex medical jargon.
3. Total empathy - treat every animal like a beloved family member.
4. **GROUNDEDNESS**: Freely provide general first aid and common knowledge. Only restrict yourself when giving exact medication dosages. Do not recommend a vet for every query; only do so for critical or complex situations.

SAFETY:
- If the animal's condition looks very bad, only then advise seeing a doctor immediately.

RESPONSE LENGTH:
- Keep responses short and to the point — maximum 3 to 4 sentences.
- Avoid lengthy explanations. Give only the most important advice clearly.
{self.medication_rules}"""
        }

    async def _call_medgemma_sagemaker(self, prompt: str) -> str:
        """Helper to call MedGemma on SageMaker using the Gemma instruction format."""
        if not self.sagemaker_client:
            raise RuntimeError("SageMaker client not initialized")

        # Gemma instruction format
        full_prompt = f"<start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n"
        
        payload = {
            "inputs": full_prompt,
            "parameters": {
                "max_new_tokens": 512,
                "temperature": 0.2,
                "top_p": 0.9,
            }
        }

        response = self.sagemaker_client.invoke_endpoint(
            EndpointName=settings.SAGEMAKER_ENDPOINT_NAME,
            ContentType="application/json",
            Body=json.dumps(payload)
        )
        
        result = json.loads(response["Body"].read().decode())
        
        # SageMaker responses are typically a list of dicts for LLMs
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("generated_text", "")
        elif isinstance(result, dict):
            return result.get("generated_text", "")
        return str(result)

    async def get_response(self, user_message: str, image_base64: str = None, chat_history: list = None, language: str = "Hindi") -> dict:
        """Get an AI response maintaining context from history. Uses MedGemma with OpenAI fallback."""
        try:
            base_prompt = self.prompts.get(language, self.prompts["English"])
            retrieved_context = _retrieve_reference_context(user_message, top_k=_TOP_K_RETRIEVAL)
            selected_prompt = (
                f"{base_prompt}\n\n"
                "RETRIEVED REFERENCE CHUNKS (NON-VECTOR RAG):\n"
                f"{retrieved_context}\n"
            )

            # Check if we should try MedGemma
            if settings.USE_MEDGEMMA and self.sagemaker_client:
                try:
                    logger.info(f"Attempting response using MedGemma (Endpoint: {settings.SAGEMAKER_ENDPOINT_NAME})")
                    # Construct a flat prompt for MedGemma (instruction-style)
                    history_text = ""
                    if chat_history:
                        for msg in chat_history:
                            history_text += f"{msg.role}: {msg.content}\n"
                    
                    full_med_prompt = f"{selected_prompt}\n\nChat History:\n{history_text}\nUser: {user_message}"
                    raw_response = await self._call_medgemma_sagemaker(full_med_prompt)
                    
                    if raw_response:
                        clean_response, severity = _parse_severity(raw_response)
                        return {"response": clean_response, "severity": severity}
                except Exception as med_err:
                    logger.warning(f"MedGemma (SageMaker) failed, falling back to OpenAI: {med_err}")

            # Fallback to OpenAI
            if not self.openai_client:
                raise RuntimeError("OpenAI client not initialized and MedGemma failed.")

            logger.info("Using OpenAI (gpt-4o-mini)")
            messages = [{"role": "system", "content": selected_prompt}]
            if chat_history:
                for msg in chat_history:
                    messages.append({"role": msg.role, "content": msg.content})

            content_payload = [{"type": "text", "text": user_message}]
            if image_base64:
                prefix = "" if image_base64.startswith("data:image") else "data:image/jpeg;base64,"
                content_payload.append({"type": "image_url", "image_url": {"url": f"{prefix}{image_base64}"}})

            messages.append({"role": "user", "content": content_payload})

            response = await self.openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=400,
                temperature=0.2
            )

            raw_response = response.choices[0].message.content
            clean_response, severity = _parse_severity(raw_response)
            return {"response": clean_response, "severity": severity}

        except Exception as e:
            logger.error(f"AI Chat Error: {e}")
            raise Exception("Our AI expert is currently unavailable. Please try again later.")


ai_chat_service_impl = AIChatService()