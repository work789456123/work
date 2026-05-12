import uuid
import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    title = Column(String(200), nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    severity = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")
