from typing import List
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
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

@router.post("", response_model=AppointmentResponse)
async def create_appointment(
    appointment_in: AppointmentCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_appointment = await crud_appointment.create(db, appointment_in=appointment_in, user_id=current_user.id)
    
    # Run email asynchronously in FastAPI bg task worker
    email_content = f"""
    <h2>Appointment Request Received</h2>
    <p>Dear {appointment_in.owner_name},</p>
    <p>We have received your appointment request for {appointment_in.pet_name}.</p>
    <p>Time Slot: {appointment_in.time_slot}</p>
    <p>Our team will contact you shortly to confirm the appointment.</p>
    """
    background_tasks.add_task(send_confirmation_email_background, current_user.phone_or_email, email_content)
    
    return db_appointment

@router.get("", response_model=List[AppointmentResponse])
async def get_appointments(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud_appointment.get_multi_by_user(db, user_id=current_user.id)
