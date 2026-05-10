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

class AdminPasswordResetTicketCreate(BaseModel):
    email: str

class AdminPasswordResetTicketResponse(BaseModel):
    id: str
    email: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class MedicalEmergencyCreate(BaseModel):
    mobile_number: str
    description: str

class MedicalEmergencyResponse(BaseModel):
    id: str
    mobile_number: str
    description: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
