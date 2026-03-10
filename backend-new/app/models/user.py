import uuid
from sqlalchemy import Column, String, Boolean, Float, Integer, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String, index=True, nullable=False)
    phone_or_email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user") # 'user' or 'admin'
    credits_remaining = Column(Integer, default=0, nullable=False)
    daily_message_count = Column(Integer, default=0, nullable=False)
    last_message_at = Column(DateTime, nullable=True)
    has_subscription = Column(Boolean, default=False, nullable=False)

    pets = relationship("Pet", back_populates="owner", cascade="all, delete-orphan")
    appointments = relationship("Appointment", back_populates="user", cascade="all, delete-orphan")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")
