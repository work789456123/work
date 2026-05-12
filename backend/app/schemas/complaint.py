import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.models.complaint_model import ComplaintStatus, ComplaintPriority

class ComplaintBase(BaseModel):
    title: str
    description: str
    symptoms: Optional[str] = None
    priority: Optional[ComplaintPriority] = ComplaintPriority.LOW
    pet_id: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    book_appointment: bool = False
    appointment_time_slot: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: str
    user_id: str
    status: ComplaintStatus
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    class Config:
        from_attributes = True

class ComplaintLogResponse(BaseModel):
    id: str
    complaint_id: str
    status: str
    updated_by: str
    notes: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True
