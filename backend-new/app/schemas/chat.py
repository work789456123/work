from pydantic import BaseModel
from typing import Optional

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    image_base64: Optional[str] = None

class SpeechTranscribe(BaseModel):
    audio_base64: str
    language: Optional[str] = None

class SpeechSynthesize(BaseModel):
    text: str
