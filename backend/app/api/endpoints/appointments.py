from typing import List
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import httpx

from app.db.session import get_db
from app.schemas.appointment import AppointmentCreate, AppointmentResponse
from app.crud.appointment import crud_appointment
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.email_service import email_service_impl
from app.core.config import settings

router = APIRouter()


def send_confirmation_email_background(to_email: str, content: str):
    email_service_impl.send_email(
        to_email=to_email,
        subject="Appointment Request Received - PashuVaani",
        html_content=content
    )


async def send_slack_notification(appointment_id: str, appointment_in: AppointmentCreate, user_email: str):
    """Fire a Slack Block Kit message with Confirm/Cancel buttons."""
    if not settings.SLACK_WEBHOOK_URL_APPOINTMENTS:
        return
    try:
        # Build the interactive Block Kit message
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🗓️ New Appointment Booked",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*User:*\n{user_email}"},
                    {"type": "mrkdwn", "text": f"*Time Slot:*\n{appointment_in.time_slot}"},
                    {"type": "mrkdwn", "text": f"*Pet:*\n{appointment_in.pet_name} ({appointment_in.pet_type}, {appointment_in.gender})"},
                    {"type": "mrkdwn", "text": f"*Owner:*\n{appointment_in.owner_name} — {appointment_in.owner_number}"},
                ]
            },
            {"type": "divider"},
            {
                "type": "actions",
                "block_id": f"appt_{appointment_id}",
                "elements": [
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "✅ Confirm", "emoji": True},
                        "style": "primary",
                        "action_id": "confirm_appointment",
                        "value": appointment_id,
                    },
                    {
                        "type": "button",
                        "text": {"type": "plain_text", "text": "❌ Cancel", "emoji": True},
                        "style": "danger",
                        "action_id": "cancel_appointment",
                        "value": appointment_id,
                    },
                ]
            }
        ]

        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(settings.SLACK_WEBHOOK_URL_APPOINTMENTS, json={"blocks": blocks})
    except Exception:
        pass  # Never let Slack failure break the booking


@router.post("", response_model=AppointmentResponse)
async def create_appointment(
    appointment_in: AppointmentCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_appointment = await crud_appointment.create(db, appointment_in=appointment_in, user_id=current_user.id)

    # Confirmation email (background)
    email_content = f"""
    <h2>Appointment Request Received</h2>
    <p>Dear {appointment_in.owner_name},</p>
    <p>We have received your appointment request for {appointment_in.pet_name}.</p>
    <p>Time Slot: {appointment_in.time_slot}</p>
    <p>Our team will contact you shortly to confirm the appointment.</p>
    """
    background_tasks.add_task(
        send_confirmation_email_background,
        current_user.phone_or_email,
        email_content,
    )

    # Slack notification with interactive buttons
    await send_slack_notification(db_appointment.id, appointment_in, current_user.phone_or_email)

    return db_appointment


@router.get("", response_model=List[AppointmentResponse])
async def get_appointments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud_appointment.get_multi_by_user(db, user_id=current_user.id)
