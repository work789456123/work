import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class PetCabBooking(Base):
    __tablename__ = "pet_cab_bookings"

    id = Column(String, primary_key=True, default=lambda: f"CAB-{str(uuid.uuid4())[:8].upper()}")
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    owner_name = Column(String, nullable=False)
    owner_number = Column(String, nullable=False)
    
    pickup_location = Column(String, nullable=False)
    drop_location = Column(String, nullable=False)
    pickup_date = Column(String, nullable=False)
    pickup_time = Column(String, nullable=False)
    
    pet_type = Column(String, nullable=False)
    pet_breed = Column(String, nullable=True)
    number_of_pets = Column(Integer, default=1)
    
    cab_preference = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=False)
    additional_notes = Column(Text, nullable=True)
    
    status = Column(String, default="Pending") # Pending, Accepted, On the Way, Completed, Cancelled
    driver_details = Column(String, nullable=True)
    
    user = relationship("User")
