import uuid
import datetime
from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    status = Column(String, default="Active")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    animals = relationship("Animal", back_populates="farmer", cascade="all, delete-orphan")
    consultations = relationship("FarmConsultation", back_populates="farmer", cascade="all, delete-orphan")

class Animal(Base):
    __tablename__ = "animals"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tag_id = Column(String, unique=True, index=True, nullable=False)
    species = Column(String, nullable=False)
    breed = Column(String, nullable=False)
    health_status = Column(String, nullable=False)
    recent_diagnosis = Column(String, nullable=True)
    farmer_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    farmer = relationship("Farmer", back_populates="animals")
    consultations = relationship("FarmConsultation", back_populates="animal", cascade="all, delete-orphan")

class FarmConsultation(Base):
    __tablename__ = "farm_consultations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_id = Column(String, unique=True, index=True, nullable=False)
    animal_id = Column(String, ForeignKey("animals.id"), nullable=False)
    farmer_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    symptom = Column(String, nullable=False)
    diagnosis = Column(String, nullable=False)
    status = Column(String, default="Active")
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    farmer = relationship("Farmer", back_populates="consultations")
    animal = relationship("Animal", back_populates="consultations")

class AIAlert(Base):
    __tablename__ = "ai_alerts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_id = Column(String, unique=True, index=True, nullable=False)
    farm = Column(String, nullable=False)
    tag_id = Column(String, nullable=False)
    type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    time_label = Column(String, nullable=False)
    status = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
