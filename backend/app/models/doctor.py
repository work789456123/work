import datetime
import uuid
from sqlalchemy import Column, String, Float, Integer, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    
    specialization = Column(String, nullable=False)
    qualification = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=False, default=0)
    
    availability_status = Column(String, default="available") # available, busy, unavailable
    rating = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    
    # Keeping some old fields for compatibility if needed, or merging
    # name = Column(String, nullable=False) # Should probably come from User
    image = Column(String, nullable=True)
    consultation_fee = Column(String, nullable=True)
    languages = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    user = relationship("User")
