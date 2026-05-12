"""WhatsApp conversation session — tracks per-phone-number state for the bot."""

import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class WhatsAppSession(Base):
    __tablename__ = "whatsapp_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_number = Column(String, unique=True, index=True, nullable=False)

    # Finite-state for multi-step flows
    # Values: idle, diagnosing, booking_pet_name, booking_pet_type,
    #         booking_gender, booking_owner_name, booking_owner_number,
    #         booking_time_slot, booking_confirm
    state = Column(String, default="idle", nullable=False)

    # Temporary JSON blob for in-progress booking data
    state_data = Column(Text, default="{}", nullable=False)

    # Detected language: "Hindi" or "English"
    language = Column(String, default="English", nullable=False)

    # Link to an existing PashuVaani user (auto-created by phone number)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)

    # Last N messages serialized as JSON for AI context
    chat_history = Column(Text, default="[]", nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", lazy="joined")
