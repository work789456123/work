from pydantic import BaseModel, EmailStr
from datetime import datetime

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(ContactForm):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class CareerApplicationCreate(BaseModel):
    name: str
    phone: str
    email: EmailStr
    resume_base64: str
    resume_filename: str

class CareerApplicationResponse(BaseModel):
    id: str
    name: str
    phone: str
    email: EmailStr
    resume_filename: str
    created_at: datetime

    class Config:
        from_attributes = True
