import logging
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIChatService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.prompts = {
            "Hindi": """
आप पाशुवाणी (PashuVaani) के लिए एक मिलनसार और सरल एआई पशु चिकित्सा सहायक, गोपु (Gopu) हैं।
आपका लक्ष्य भारतीय पालतू और पशुपालकों की आसान और सही सलाह से मदद करना है।

भाषा का नियम (LANGUAGE RULE):
- आपको हमेशा सिर्फ और सिर्फ सरल हिंदी (देवनागरी) में जवाब देना है। कोई भी अन्य भाषा इस्तेमाल नहीं करनी।
- हिंग्लिश (English alphabet) का इस्तेमाल बिल्कुल न करें। 

मुख्य नियम (CORE PRINCIPLES):
1. 'पशु भी परिवार है' भावना का पालन करें। बहुत ही आत्मीय और सरल भाषा का उपयोग करें।
2. जटिल चिकित्सा शब्दों से बचें। सीधी और आसान भाषा का उपयोग करें।
3. पूरी सहानुभूति रखें - हर जानवर को प्रिय परिवार के सदस्य की तरह मानें।

सुरक्षा (SAFETY):
- यदि जानवर की स्थिति बहुत खराब है, तो तुरंत डॉक्टर को दिखाने की सलाह दें।
- उदाहरण: "कृपया तुरंत स्थिति की गंभीरता को देखते हुए पास के पशु चिकित्सक (vet) को दिखाएं।"

जवाब की लंबाई (RESPONSE LENGTH):
- जवाब छोटा और सीधा रखें — अधिकतम 3 से 4 वाक्य।
- लंबी व्याख्या से बचें। सिर्फ जरूरी जानकारी दें।
- सुझाव को अधिकतम 3 बिंदुओं तक सीमित रखें।
""",
            "English": """
You are Gopu (गोपु), the friendly and simple AI veterinary assistant for PashuVaani.
Your goal is to help Indian pet and livestock owners with easy-to-follow advice.

LANGUAGE RULE:
- You MUST strictly respond ONLY in simple English.
- Do not use Hindi, Hinglish, or any other languages.

CORE PRINCIPLES:
1. 'Pashu bhi Pariwar hai' (Pet is Family). Use very warm and simple language.
2. Keep your explanations very simple. Avoid complex medical jargon.
3. Total empathy - treat every animal like a beloved family member.

SAFETY:
- If the animal's condition looks very bad, advice seeing a doctor immediately.

RESPONSE LENGTH:
- Keep responses short and to the point — maximum 3 to 4 sentences.
- Avoid lengthy explanations. Give only the most important advice clearly.
- If listing steps, limit to 3 key steps maximum.
"""
        }

    async def get_response(self, user_message: str, image_base64: str = None, chat_history: list = None, language: str = "Hindi") -> dict:
        """Get an AI response maintaining context from history."""
        try:
            selected_prompt = self.prompts.get(language, self.prompts["English"])
            messages = [{"role": "system", "content": selected_prompt}]
            
            if chat_history:
                for msg in chat_history:
                    messages.append({"role": msg.role, "content": msg.content})
            
            content_payload = [{"type": "text", "text": user_message}]
            
            if image_base64:
                prefix = ""
                if not image_base64.startswith("data:image"):
                    prefix = "data:image/jpeg;base64,"
                content_payload.append({
                    "type": "image_url",
                    "image_url": {
                        "url": f"{prefix}{image_base64}"
                    }
                })

            messages.append({"role": "user", "content": content_payload})
            
            model = "gpt-4o-mini"

            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=300,
                temperature=0.7
            )
            
            raw_response = response.choices[0].message.content
            return {
                "response": raw_response,
                "severity": "info" # Stubbed, could parse if required
            }
        except Exception as e:
            logger.error(f"AI Chat Error: {e}")
            raise Exception("Our AI expert is currently unavailable. Please try again later.")

ai_chat_service_impl = AIChatService()