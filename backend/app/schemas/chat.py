from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    image_base64: Optional[str] = None
    language: Optional[str] = "Hindi"
    pet_id: Optional[str] = None


class SpeechTranscribe(BaseModel):
    audio_base64: str
    language: Optional[str] = None


class SpeechSynthesize(BaseModel):
    text: str


class MessageOut(BaseModel):
    id: str
    role: str
    content: str
    severity: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SessionOut(BaseModel):
    id: str
    title: Optional[str] = None
    summary: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SessionHistoryOut(BaseModel):
    session_id: str
    title: Optional[str] = None
    messages: List[MessageOut]
