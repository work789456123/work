import secrets
from datetime import datetime, timedelta
from jose import jwt
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.user import (
    UserRegister, UserLogin, UserResponse,
    ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest,
)
from app.crud.user import crud_user, pwd_context
from app.api.dependencies import get_current_user
from app.core.config import settings
from app.services.email_service import email_service_impl
from app.services import otp_service

router = APIRouter()

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/register")
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    # Basic email/phone check
    if not user_in.phone_or_email:
        raise HTTPException(status_code=400, detail="Phone or email is required")

    user = await crud_user.get_by_phone_or_email(db, phone_or_email=user_in.phone_or_email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email/phone already exists in the system."
        )
    
    new_user = await crud_user.create(
        db, 
        user_in=user_in, 
        role=user_in.role if hasattr(user_in, 'role') else "user"
    )
    
    # Safe re-fetch to ensure all fields like UUID are populated as raw strings correctly
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=user_in.phone_or_email)
    
    token_data = {"sub": str(user.id), "email": user.phone_or_email, "role": user.role}
    token = create_access_token(token_data)
    
    return {
        "msg": "Registration successful.",
        "access_token": token,
        "user": {"id": str(user.id), "full_name": user.full_name, "role": user.role}
    }

# Verification endpoints removed as not needed for now

@router.post("/login")
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=user_in.phone_or_email)
    if not user or not pwd_context.verify(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    token_data = {"sub": user.id, "email": user.phone_or_email, "role": user.role}
    token = create_access_token(token_data)
    
    return {"access_token": token, "user": {"id": user.id, "full_name": user.full_name, "role": user.role}}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user


# ─── Forgot Password / OTP flow ──────────────────────────────────────────────

@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """
    Step 1 – Request a 6-digit OTP.

    We intentionally return the same 200 response whether the email exists
    or not to prevent user enumeration.
    """
    email = body.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="A valid email address is required.")

    # Only send if the user actually exists (but don't reveal that in the response)
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=email)
    if user:
        result = await otp_service.request_otp(db, email)
        if not result["success"]:
            # Rate-limited
            raise HTTPException(
                status_code=429,
                detail=result["message"],
                headers={"Retry-After": str(result.get("retry_after", 60))},
            )

    return {"message": "If an account exists for this email, an OTP has been sent."}


@router.post("/verify-otp")
async def verify_otp(body: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    """Step 2 – Verify the OTP. Returns a short-lived reset_token on success."""
    email = body.email.strip().lower()
    otp = body.otp.strip()

    if len(otp) != 6 or not otp.isdigit():
        raise HTTPException(status_code=400, detail="OTP must be exactly 6 digits.")

    result = await otp_service.verify_otp(db, email, otp)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return {"message": result["message"], "reset_token": result["reset_token"]}


@router.post("/reset-password")
async def reset_password(body: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Step 3 – Set the new password using the reset_token from step 2."""
    if body.new_password != body.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    if len(body.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    result = await otp_service.reset_password(db, body.reset_token, body.new_password)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return {"message": result["message"]}
