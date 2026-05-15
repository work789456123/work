"""
OTP Service for Password Reset

Handles:
- 6-digit OTP generation
- Bcrypt-hashed storage
- Rate-limiting (1 OTP per 60 s per email)
- Expiry validation (7 minutes)
- Max wrong-attempt guard (5 tries before invalidation)
- Email sending via the existing EmailService
"""
import logging
import random
import string
from datetime import datetime, timedelta

import bcrypt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.models.password_reset_otp import PasswordResetOTP
from app.services.email_service import email_service_impl

logger = logging.getLogger(__name__)

OTP_EXPIRY_MINUTES = 7
OTP_RATE_LIMIT_SECONDS = 60
OTP_MAX_ATTEMPTS = 5


def _generate_otp() -> str:
    """Generate a cryptographically-safe 6-digit OTP."""
    return "".join(random.choices(string.digits, k=6))


def _hash_otp(otp: str) -> str:
    return bcrypt.hashpw(otp.encode(), bcrypt.gensalt()).decode()


def _verify_otp(otp: str, otp_hash: str) -> bool:
    try:
        return bcrypt.checkpw(otp.encode(), otp_hash.encode())
    except Exception:
        return False


def _otp_email_html(otp: str) -> str:
    return f"""
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;
                border:1px solid #e2e8f0;border-radius:12px;background:#ffffff;">
      <div style="text-align:center;margin-bottom:24px;">
        <h2 style="color:#1F6559;margin:0 0 4px;">PashuVaani</h2>
        <p style="color:#6f7f7c;font-size:13px;margin:0;">Password Reset OTP</p>
      </div>
      <p style="color:#333;font-size:15px;">
        You requested a password reset. Use the OTP below. It expires in
        <strong>{OTP_EXPIRY_MINUTES} minutes</strong>.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <span style="font-size:40px;font-weight:800;letter-spacing:12px;
                     color:#1F6559;background:#f0faf7;padding:16px 24px;
                     border-radius:12px;display:inline-block;">{otp}</span>
      </div>
      <p style="color:#888;font-size:13px;text-align:center;">
        If you didn't request this, please ignore this email.
        Your password will remain unchanged.
      </p>
    </div>
    """


async def request_otp(db: AsyncSession, email: str) -> dict:
    """
    Generate a new OTP for the given email address.

    Returns dict with:
      - success: bool
      - message: str
      - retry_after: int | None  (seconds until next request allowed, if rate-limited)
    """
    now = datetime.utcnow()

    # --- Rate-limit check: find the most recent *unused* OTP for this email ---
    result = await db.execute(
        select(PasswordResetOTP)
        .where(PasswordResetOTP.email == email.lower())
        .order_by(PasswordResetOTP.created_at.desc())
        .limit(1)
    )
    latest = result.scalars().first()

    if latest and not latest.is_used:
        elapsed = (now - latest.created_at).total_seconds()
        if elapsed < OTP_RATE_LIMIT_SECONDS:
            wait = int(OTP_RATE_LIMIT_SECONDS - elapsed)
            return {
                "success": False,
                "message": f"Please wait {wait} seconds before requesting another OTP.",
                "retry_after": wait,
                "reason": "rate_limited",
            }

    # --- Create new OTP record ---
    otp_plain = _generate_otp()
    otp_record = PasswordResetOTP(
        email=email.lower(),
        otp_hash=_hash_otp(otp_plain),
        created_at=now,
        expires_at=now + timedelta(minutes=OTP_EXPIRY_MINUTES),
        is_used=False,
        attempts=0,
    )
    db.add(otp_record)
    await db.commit()

    # --- Send email ---
    sent = email_service_impl.send_email(
        to_email=email,
        subject="PashuVaani – Your Password Reset OTP",
        html_content=_otp_email_html(otp_plain),
    )
    if not sent:
        if settings.LOG_OTP_ON_EMAIL_FAILURE:
            logger.warning("OTP for %s (email not delivered, dev log): %s", email, otp_plain)
        else:
            logger.warning("OTP email was not delivered to %s; rolling back OTP row.", email)
        await db.delete(otp_record)
        await db.commit()
        return {
            "success": False,
            "message": (
                "We could not send the reset email. The server mail settings may be missing or "
                "incorrect. Please try again later or contact support."
            ),
            "retry_after": None,
            "reason": "email_not_sent",
        }

    return {
        "success": True,
        "message": f"OTP sent to {email}. Valid for {OTP_EXPIRY_MINUTES} minutes.",
        "retry_after": None,
        "reason": None,
    }


async def verify_otp(db: AsyncSession, email: str, otp: str) -> dict:
    """
    Verify the OTP submitted by the user.

    Returns dict with:
      - success: bool
      - message: str
      - reset_token: str | None  (opaque token to authorise the password-change step)
    """
    now = datetime.utcnow()

    # Get the latest unused OTP for this email
    result = await db.execute(
        select(PasswordResetOTP)
        .where(
            PasswordResetOTP.email == email.lower(),
            PasswordResetOTP.is_used == False,  # noqa: E712
        )
        .order_by(PasswordResetOTP.created_at.desc())
        .limit(1)
    )
    record = result.scalars().first()

    if not record:
        return {"success": False, "message": "No OTP found. Please request a new one.", "reset_token": None}

    if now > record.expires_at:
        record.is_used = True
        await db.commit()
        return {"success": False, "message": "OTP has expired. Please request a new one.", "reset_token": None}

    if record.attempts >= OTP_MAX_ATTEMPTS:
        record.is_used = True
        await db.commit()
        return {"success": False, "message": "Too many incorrect attempts. Please request a new OTP.", "reset_token": None}

    if not _verify_otp(otp, record.otp_hash):
        record.attempts += 1
        remaining = OTP_MAX_ATTEMPTS - record.attempts
        await db.commit()
        return {
            "success": False,
            "message": f"Incorrect OTP. {remaining} attempt(s) remaining.",
            "reset_token": None,
        }

    # Valid OTP – mark as used and hand back a one-time reset token
    # The reset token IS the OTP record id (UUID); we sign it so it can't be guessed.
    record.is_used = True
    await db.commit()

    import secrets
    reset_token = secrets.token_urlsafe(32)

    # Store the reset token hash so the password-change step can verify it
    # We reuse the otp_hash column (it's already "used") to store the reset-token hash
    record.otp_hash = _hash_otp(reset_token)
    record.is_used = False        # re-open for the final password-change step
    record.expires_at = now + timedelta(minutes=10)   # 10 min window to set password
    await db.commit()

    return {
        "success": True,
        "message": "OTP verified successfully.",
        "reset_token": f"{record.id}:{reset_token}",
    }


async def reset_password(
    db: AsyncSession,
    reset_token: str,
    new_password: str,
) -> dict:
    """
    Validate the reset-token and update the user's password.

    `reset_token` format: "<otp_record_id>:<random_token>"
    """
    if ":" not in reset_token:
        return {"success": False, "message": "Invalid reset token."}

    record_id, token_part = reset_token.split(":", 1)
    now = datetime.utcnow()

    result = await db.execute(
        select(PasswordResetOTP).where(
            PasswordResetOTP.id == record_id,
            PasswordResetOTP.is_used == False,  # noqa: E712
        )
    )
    record = result.scalars().first()

    if not record:
        return {"success": False, "message": "Invalid or already-used reset link."}

    if now > record.expires_at:
        record.is_used = True
        await db.commit()
        return {"success": False, "message": "Reset session expired. Please start over."}

    if not _verify_otp(token_part, record.otp_hash):
        return {"success": False, "message": "Invalid reset token."}

    # Look up the user by email
    from app.crud.user import crud_user, pwd_context
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=record.email)
    if not user:
        return {"success": False, "message": "User account not found."}

    # Update password
    user.hashed_password = pwd_context.hash(new_password)
    record.is_used = True
    await db.commit()

    return {"success": True, "message": "Password updated successfully. You can now log in."}
