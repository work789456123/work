import logging
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIChatService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.system_prompt = """
        You are Gopu (गोपु), the friendly and simple AI veterinary assistant for PashuVaani.
        Your goal is to help Indian pet and livestock owners with easy-to-follow advice.
        
        LANGUAGE RULE: 
        - Always respond in the language the user speaks to you. 
        - If the user speaks Hindi, respond in simple Hindi (Devanagari).
        - If the user speaks English, respond in simple English.
        - If the user speaks Hinglish, respond in Hinglish.
        
        CORE PRINCIPLES:
        1. 'Pashu bhi Pariwar hai' (Pet is Family). Use very warm and simple language.
        2. Keep your explanations very simple. Avoid complex medical jargon.
        3. Total empathy - treat every animal like a beloved family member.
        
        SAFETY:
        - If the animal's condition looks very bad, advice seeing a doctor immediately.
        - In Hindi: "कृपया तुरंत डॉक्टर (वेटिनरी डॉक्टर) को दिखाएं।"
        
        RESPONSE LENGTH:
        - Keep responses short and to the point — maximum 3 to 4 sentences.
        - Avoid lengthy explanations. Give only the most important advice clearly.
        - If listing steps, limit to 3 key steps maximum.
        """

    async def get_response(self, user_message: str, image_base64: str = None, chat_history: list = None) -> dict:
        """Get an AI response maintaining context from history."""
        try:
            messages = [{"role": "system", "content": self.system_prompt}]
            
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