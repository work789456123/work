import uuid
import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer
from app.db.base_class import Base

class DoctorApplication(Base):
    __tablename__ = "doctor_applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    qualification = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    experience_years = Column(Integer, nullable=False)
    district = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, approved, rejected
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class EmergencyLog(Base):
    __tablename__ = "emergency_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class AdminPasswordResetTicket(Base):
    __tablename__ = "admin_password_reset_tickets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
