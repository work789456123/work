import os
from dotenv import load_dotenv
import base64
from typing import Optional
import asyncio

load_dotenv()

SYSTEM_MESSAGE = """You are Gopu, a caring AI veterinary assistant for PashuVaani."""

class GopuAI:
    def __init__(self):
        self.api_key = os.getenv("EMERGENT_LLM_KEY", "mock_key")
        self.chat_sessions = {}  # Store conversation context
        
    async def chat(self, session_id: str, message: str, image_base64: Optional[str] = None) -> dict:
        """Mock AI response for local testing"""
        await asyncio.sleep(1) # Simulate network delay
        
        # Simple mock responses based on keywords
        msg_lower = message.lower()
        if "emergency" in msg_lower or "blood" in msg_lower:
            response = "This sounds critical. I understand you are worried. Are they breathing normally? This is an emergency. Please take your pet to a veterinarian immediately. This is advisory guidance. Please consult a veterinarian for treatment."
            severity = "red"
        elif "vomit" in msg_lower:
            response = "I understand your pet is vomiting. When did this start? Please ensure they have access to freshwater. This is advisory guidance. Please consult a veterinarian for treatment."
            severity = "yellow"
        else:
            response = "I understand your concern. Can you tell me if they are eating normally? Keep them comfortable and observe. This is advisory guidance. Please consult a veterinarian for treatment."
            severity = "green"

        return {
            "response": response,
            "severity": severity,
            "session_id": session_id
        }

gopu_ai = GopuAI()