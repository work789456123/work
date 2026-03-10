import logging
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

class AIChatService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.system_prompt = """
        You are Gopu, an AI veterinary assistant for PashuVaani.
        You provide helpful, caring, and accurate advice for pet and livestock owners.
        IMPORTANT: Your audience primarily speaks Hindi. If the user talks to you in Hindi or Hinglish, respond natively in Hindi (using Devanagari script for formal or Hinglish for casual if appropriate). Keep your tone warm and supportive, as 'Pashu bhi Pariwar hai'.
        Always suggest consulting a physical vet for serious symptoms.
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
            
            model = "gpt-4o-mini" if image_base64 else "gpt-3.5-turbo"

            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                max_tokens=600,
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
