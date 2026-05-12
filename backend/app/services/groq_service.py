"""AI Chat Service for Telegram Bot — using Groq Llama3."""

import logging
from typing import Any, List

from groq import AsyncGroq
from app.core.config import settings

logger = logging.getLogger(__name__)


class GroqChatService:
    def __init__(self):
        self._client = None
        self.model = "llama-3.3-70b-versatile"

    @property
    def client(self):
        if self._client is None:
            if not settings.GROQ_API_KEY:
                raise ValueError("GROQ_API_KEY is not set in .env")
            self._client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        return self._client

    async def get_response(
        self,
        user_message: str,
        chat_history: List[Any],
        language: str = "English",
    ) -> dict:
        system_prompt = self._get_system_prompt(language)
        messages = [{"role": "system", "content": system_prompt}]
        for msg in chat_history:
            role = "assistant" if msg.role == "assistant" else "user"
            messages.append({"role": role, "content": msg.content})
        messages.append({"role": "user", "content": user_message})

        try:
            completion = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.2,
                max_tokens=1024,
            )
            response_text = completion.choices[0].message.content
            severity = "low"
            critical_keywords = ["emergency", "severe", "bleeding", "unconscious", "dying", "गंभीर", "आपातकालीन"]
            if any(word in response_text.lower() for word in critical_keywords):
                severity = "critical"
            return {"response": response_text, "severity": severity}

        except Exception as e:
            logger.error(f"Groq API Error (model={self.model}): {type(e).__name__}: {e}")
            raise e

    def _get_system_prompt(self, language: str) -> str:
        if language == "Hindi":
            return (
                "आप 'गोपु' हैं, पशुवाणी के आधिकारिक AI पशु स्वास्थ्य सहायक। "
                "आपका लक्ष्य पालतू जानवरों और पशुधन के स्वास्थ्य समस्याओं को पहचानने में मदद करना है। "
                "सहानुभूतिपूर्ण और पेशेवर बनें। हिंदी में जवाब दें। "
                "यदि स्थिति गंभीर लगती है, तो तुरंत डॉक्टर से मिलने की सलाह दें।"
            )
        return (
            "You are 'Gopu', the official AI animal healthcare assistant for PashuVaani. "
            "Your goal is to help pet owners and farmers identify health problems in their animals. "
            "Be empathetic, professional, and accessible. "
            "Ask 1-2 follow-up questions to narrow down the issue, then provide safe first-aid advice. "
            "If the condition sounds severe or life-threatening, immediately recommend booking a vet."
        )


groq_chat_service = GroqChatService()
