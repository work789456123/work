from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    full_name: str
    phone_or_email: str
    password: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    phone_or_email: str
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    phone_or_email: str
    role: str
    credits_remaining: int
    has_subscription: bool
    
    class Config:
        from_attributes = True

class CreditPurchase(BaseModel):
    plan_type: str
    payment_id: str
