from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class FarmerBase(BaseModel):
    name: str
    location: str
    contact: str
    status: str = "Active"

class FarmerCreate(FarmerBase):
    pass

class FarmerResponse(FarmerBase):
    id: str
    created_at: datetime
    animal_count: int = 0

    class Config:
        from_attributes = True

class AnimalBase(BaseModel):
    tag_id: str
    species: str
    breed: str
    health_status: str
    recent_diagnosis: Optional[str] = None
    farmer_id: str

class AnimalCreate(AnimalBase):
    pass

class AnimalResponse(AnimalBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class FarmConsultationBase(BaseModel):
    ticket_id: str
    animal_id: str
    farmer_id: str
    symptom: str
    diagnosis: str
    status: str = "Active"

class FarmConsultationCreate(FarmConsultationBase):
    pass

class FarmConsultationResponse(FarmConsultationBase):
    id: str
    date: datetime
    
    # Extras for frontend convenience
    animal_tag: Optional[str] = None
    animal_species: Optional[str] = None
    farmer_name: Optional[str] = None

    class Config:
        from_attributes = True

class AIAlertBase(BaseModel):
    alert_id: str
    farm: str
    tag_id: str
    type: str
    confidence: float
    time_label: str
    status: str
    description: str

class AIAlertCreate(AIAlertBase):
    pass

class AIAlertResponse(AIAlertBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
