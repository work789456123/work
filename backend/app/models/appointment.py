import datetime
import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    complaint_id = Column(String, ForeignKey("complaints.id"), unique=True, nullable=True)
    doctor_id = Column(String, ForeignKey("doctors.id"), nullable=True)
    
    pet_name = Column(String, nullable=False)
    pet_type = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    age = Column(String, nullable=True)
    weight = Column(String, nullable=True)
    weight_unit = Column(String, default="KG")
    
    owner_name = Column(String, nullable=False)
    owner_number = Column(String, nullable=False)
    
    vaccination_status = Column(Boolean, default=False)
    medical_history_available = Column(Boolean, default=False)
    medical_history = Column(String, nullable=True)
    
    time_slot = Column(String, nullable=False) # In ER diagram this is appointment_time (timestamp), but keeping compatibility for now
    status = Column(String, default="SCHEDULED") # SCHEDULED, COMPLETED, CANCELLED, RESCHEDULED
    
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    user = relationship("User", back_populates="appointments")
    complaint = relationship("Complaint", back_populates="appointment")
    doctor = relationship("Doctor")
