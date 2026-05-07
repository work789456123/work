from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    phone_or_email: str
    password: str

class AdminLogin(BaseModel):
    email: str
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


# ─── Forgot-password / OTP flow ─────────────────────────────────────────────

# ─── Admin user management ───────────────────────────────────────────────────

class AdminUserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class AdminUserResponse(BaseModel):
    id: str
    full_name: str
    phone_or_email: str
    role: str
    is_verified: bool

    class Config:
        from_attributes = True


# ─── Forgot-password / OTP flow ─────────────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: str
    role: Optional[str] = None


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str
    confirm_password: str
