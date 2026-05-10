import datetime
import uuid
from enum import Enum as PyEnum
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum as SAEnum, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ComplaintStatus(str, PyEnum):
    OPEN = "OPEN"
    ASSIGNED = "ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"

class ComplaintPriority(str, PyEnum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Complaint(Base):
    __tablename__ = "complaints"

    # ID is varchar as per ER diagram: PSV-YYYY-#####
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=True)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    symptoms = Column(Text, nullable=True)
    
    priority = Column(String, default=ComplaintPriority.LOW)
    status = Column(String, default=ComplaintStatus.OPEN)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    user = relationship("User")
    pet = relationship("Pet")
    appointment = relationship("Appointment", back_populates="complaint", uselist=False)
    logs = relationship("ComplaintLog", back_populates="complaint")

class ComplaintLog(Base):
    __tablename__ = "complaint_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    complaint_id = Column(String, ForeignKey("complaints.id"), nullable=False)
    status = Column(String, nullable=False)
    updated_by = Column(String, ForeignKey("users.id"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="logs")
    updater = relationship("User")
