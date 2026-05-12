from pydantic import BaseModel
from typing import Optional

class PetCabBookingCreate(BaseModel):
    owner_name: str
    owner_number: str
    pickup_location: str
    drop_location: str
    pickup_date: str
    pickup_time: str
    pet_type: str
    pet_breed: Optional[str] = None
    number_of_pets: int = 1
    cab_preference: Optional[str] = None
    emergency_contact: str
    additional_notes: Optional[str] = None

class PetCabBookingUpdate(BaseModel):
    status: Optional[str] = None
    driver_details: Optional[str] = None

class PetCabBookingResponse(PetCabBookingCreate):
    id: str
    user_id: str
    status: str
    driver_details: Optional[str] = None

    class Config:
        from_attributes = True
