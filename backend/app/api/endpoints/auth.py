import secrets
import logging
from datetime import datetime, timedelta
from jose import jwt
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.exc import SQLAlchemyError
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
logger = logging.getLogger(__name__)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    # JWT "sub" must be a string; some callers passed ORM ids as non-strings.
    if "sub" in to_encode and to_encode["sub"] is not None:
        to_encode["sub"] = str(to_encode["sub"])
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/register")
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    # Basic email check
    if not user_in.email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = await crud_user.get_by_phone_or_email(db, phone_or_email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system."
        )
    
    new_user = await crud_user.create(
        db, 
        user_in=user_in, 
        role=user_in.role if hasattr(user_in, 'role') else "user"
    )
    
    # Safe re-fetch
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=user_in.email)
    
    token_data = {"sub": str(user.id), "email": user.phone_or_email, "role": user.role}
    token = create_access_token(token_data)
    
    return {
        "msg": "Registration successful.",
        "access_token": token,
        "user": {"id": str(user.id), "full_name": user.full_name, "role": user.role, "phone_or_email": user.phone_or_email}
    }

# Verification endpoints removed as not needed for now

@router.post("/login")
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=user_in.phone_or_email)
    if not user or not pwd_context.verify(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    token_data = {"sub": user.id, "email": user.phone_or_email, "role": user.role}
    token = create_access_token(token_data)
    
    return {"access_token": token, "user": {"id": user.id, "full_name": user.full_name, "role": user.role, "phone_or_email": user.phone_or_email}}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user


# ─── Forgot Password / OTP flow ──────────────────────────────────────────────

@router.post("/forgot-password")
async def forgot_password(body: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """
    Step 1 – Request a 6-digit OTP.

    For superadmin flow: validates the email belongs to a superadmin before sending OTP.
    For regular users: returns the same 200 response whether the email exists or not
    to prevent user enumeration.
    """
    email = body.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="A valid email address is required.")

    try:
        user = await crud_user.get_by_phone_or_email(db, phone_or_email=email)

        # Superadmin flow: explicitly validate the email is a superadmin
        if body.role == "superadmin":
            if not user or user.role != "superadmin":
                raise HTTPException(
                    status_code=400,
                    detail="No super admin account found with this email."
                )
            result = await otp_service.request_otp(db, email)
            if not result["success"]:
                raise HTTPException(
                    status_code=429,
                    detail=result["message"],
                    headers={"Retry-After": str(result.get("retry_after", 60))},
                )
            return {"message": "OTP sent to your super admin email."}

        # Regular user flow: silent success to prevent enumeration
        if user:
            if body.role and user.role != body.role:
                pass  # Don't send OTP if role doesn't match
            else:
                result = await otp_service.request_otp(db, email)
                if not result["success"]:
                    raise HTTPException(
                        status_code=429,
                        detail=result["message"],
                        headers={"Retry-After": str(result.get("retry_after", 60))},
                    )

        return {"message": "If an account exists for this email, an OTP has been sent."}
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.exception("forgot-password database error: %s", e)
        raise HTTPException(
            status_code=503,
            detail=(
                "Password reset is temporarily unavailable. "
                "If this continues, contact support — the server database may need updating."
            ),
        )


@router.post("/verify-otp")
async def verify_otp(body: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    """Step 2 – Verify the OTP. Returns a short-lived reset_token on success."""
    email = body.email.strip().lower()
    otp = body.otp.strip()

    if len(otp) != 6 or not otp.isdigit():
        raise HTTPException(status_code=400, detail="OTP must be exactly 6 digits.")

    try:
        result = await otp_service.verify_otp(db, email, otp)
    except SQLAlchemyError as e:
        logger.exception("verify-otp database error: %s", e)
        raise HTTPException(
            status_code=503,
            detail="Password reset is temporarily unavailable. Please try again later.",
        )
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

    try:
        result = await otp_service.reset_password(db, body.reset_token, body.new_password)
    except SQLAlchemyError as e:
        logger.exception("reset-password database error: %s", e)
        raise HTTPException(
            status_code=503,
            detail="Password reset is temporarily unavailable. Please try again later.",
        )
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])

    return {"message": result["message"]}
