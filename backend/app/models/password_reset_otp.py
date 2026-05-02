import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime

from app.db.base_class import Base


class PasswordResetOTP(Base):
    __tablename__ = "password_reset_otps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, index=True, nullable=False)
    otp_hash = Column(String, nullable=False)             # bcrypt hash of the 6-digit OTP
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False, nullable=False)
    attempts = Column(Integer, default=0, nullable=False)  # wrong-guess counter (max 5)
