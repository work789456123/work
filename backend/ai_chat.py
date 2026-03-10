import os
from dotenv import load_dotenv
import base64
from typing import Optional
import asyncio
from openai import AsyncOpenAI

load_dotenv()

SYSTEM_MESSAGE = """You are Gopu, a caring AI veterinary assistant for PashuVaani.
Respond to the user's pet health concerns.
Always include a severity level at the very end of your response in the format [SEVERITY: green] or [SEVERITY: yellow] or [SEVERITY: red].
Red is for critical emergencies (breathing issues, severe bleeding).
Yellow is for moderate issues (vomiting, diarrhea).
Green is for normal questions or mild concerns.
Always include a medical disclaimer that this is advisory guidance."""

class GopuAI:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=self.api_key)
        self.chat_sessions = {}
        
    async def chat(self, session_id: str, message: str, image_base64: Optional[str] = None) -> dict:
        messages = [{"role": "system", "content": SYSTEM_MESSAGE}]
        
        # Add basic conversation history if exists
        if session_id in self.chat_sessions:
            messages.extend(self.chat_sessions[session_id][-5:])
        else:
            self.chat_sessions[session_id] = []
            
        content = message
        if image_base64:
            content = [
                {"type": "text", "text": message or "What is in this image?"},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"}}
            ]
        
        user_msg = {"role": "user", "content": content}
        messages.append(user_msg)
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages
            )
            reply = response.choices[0].message.content
            
            # Extract severity
            severity = "green"
            if "[SEVERITY: red]" in reply:
                severity = "red"
                reply = reply.replace("[SEVERITY: red]", "").strip()
            elif "[SEVERITY: yellow]" in reply:
                severity = "yellow"
                reply = reply.replace("[SEVERITY: yellow]", "").strip()
            elif "[SEVERITY: green]" in reply:
                reply = reply.replace("[SEVERITY: green]", "").strip()

            # Save to history
            self.chat_sessions[session_id].append({"role": "user", "content": message if isinstance(content, str) else "Sent an image."})
            self.chat_sessions[session_id].append({"role": "assistant", "content": reply})

            return {
                "response": reply,
                "severity": severity,
                "session_id": session_id
            }
        except Exception as e:
            return {
                "response": "I apologize, but I am having trouble connecting to my knowledge base right now. Please try again or consult a veterinarian.",
                "severity": "yellow",
                "session_id": session_id
            }

gopu_ai = GopuAI()