import uuid
import datetime
from sqlalchemy import Column, String, DateTime, Text
from app.db.base_class import Base

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CareerApplication(Base):
    __tablename__ = "career_applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    email = Column(String, nullable=False)
    resume_filename = Column(String, nullable=False)
    resume_base64 = Column(Text, nullable=False) # In production we would store this in S3, keeping base64 for parity
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
