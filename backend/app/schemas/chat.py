from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

# Shared constant — used by both the endpoint and ai_chat_service.
SUMMARISE_AFTER_MESSAGES: int = 20


class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=4_000)
    session_id: Optional[str] = None
    # base64 cap ≈ 3.75 MB raw image; reject anything larger at the schema layer
    image_base64: Optional[str] = Field(None, max_length=5_200_000)
    language: Optional[str] = "Hindi"
    pet_id: Optional[str] = None


class SpeechTranscribe(BaseModel):
    audio_base64: str
    language: Optional[str] = None


class SpeechSynthesize(BaseModel):
    text: str = Field(..., max_length=2_000)


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
