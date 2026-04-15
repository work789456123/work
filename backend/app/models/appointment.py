import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
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
    
    time_slot = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, confirmed, cancelled
    
    user = relationship("User", back_populates="appointments")
