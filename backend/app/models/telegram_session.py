"""Telegram conversation session state."""

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class TelegramSession(Base):
    __tablename__ = "telegram_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    chat_id = Column(String, unique=True, index=True, nullable=False)

    # State: awaiting_language → idle → diagnosing / booking_* / etc.
    state = Column(String, default="awaiting_language", nullable=False)
    state_data = Column(Text, default="{}", nullable=False)
    language = Column(String, default="English", nullable=False)

    # Link to an existing PashuVaani user
    user_id = Column(String, ForeignKey("users.id"), nullable=True)

    # Last N messages serialized as JSON for AI context
    chat_history = Column(Text, default="[]", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", lazy="joined")
