from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class DoctorApplicationBase(BaseModel):
    name: str
    qualification: str
    specialization: str
    experience_years: int
    district: str
    email: str
    phone: str

class DoctorApplicationCreate(DoctorApplicationBase):
    pass

class DoctorApplicationResponse(DoctorApplicationBase):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class EmergencyLogResponse(BaseModel):
    id: str
    message: str
    timestamp: datetime

    class Config:
        from_attributes = True
