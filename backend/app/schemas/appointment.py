from pydantic import BaseModel
from typing import Optional

class AppointmentCreate(BaseModel):
    pet_name: str
    pet_type: str
    gender: str
    age: Optional[str] = "NA"
    weight: Optional[str] = "NA"
    weight_unit: str = "KG"
    owner_name: str
    owner_number: str
    vaccination_status: bool = False
    medical_history_available: bool = False
    medical_history: Optional[str] = ""
    time_slot: str

class AppointmentResponse(AppointmentCreate):
    id: str
    user_id: str
    status: str
    
    class Config:
        from_attributes = True
