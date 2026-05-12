from typing import List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
from datetime import datetime

from app.db.session import get_db
from app.schemas.pet_cab import PetCabBookingCreate, PetCabBookingResponse, PetCabBookingUpdate
from app.crud.pet_cab import crud_pet_cab
from app.api.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.core.config import settings
from app.services.email_service import email_service_impl

router = APIRouter()

def send_pet_cab_status_email_background(to_email: str, subject: str, content: str):
    email_service_impl.send_email(
        to_email=to_email,
        subject=subject,
        html_content=content
    )

async def send_pet_cab_slack_notification(booking_id: str, booking_in: PetCabBookingCreate, user_email: str, status: str = "Pending"):
    if not settings.SLACK_WEBHOOK_URL_PET_CABS:
        return
    try:
        blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "🚕 New Pet Cab Booking",
                    "emoji": True
                }
            },
            {
                "type": "section",
                "fields": [
                    {"type": "mrkdwn", "text": f"*Booking ID:*\n{booking_id}"},
                    {"type": "mrkdwn", "text": f"*User:*\n{booking_in.owner_name} ({user_email})"},
                    {"type": "mrkdwn", "text": f"*Pickup:*\n{booking_in.pickup_location}"},
                    {"type": "mrkdwn", "text": f"*Drop:*\n{booking_in.drop_location}"},
                    {"type": "mrkdwn", "text": f"*Date/Time:*\n{booking_in.pickup_date} at {booking_in.pickup_time}"},
                    {"type": "mrkdwn", "text": f"*Pet Details:*\n{booking_in.number_of_pets}x {booking_in.pet_type} ({booking_in.pet_breed or 'N/A'})"},
                    {"type": "mrkdwn", "text": f"*Status:*\n{status}"},
                    {"type": "mrkdwn", "text": f"*Timestamp:*\n{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"},
                ]
            }
        ]

        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(settings.SLACK_WEBHOOK_URL_PET_CABS, json={"blocks": blocks})
    except Exception:
        pass





@router.post("", response_model=PetCabBookingResponse)
async def create_pet_cab_booking(
    booking_in: PetCabBookingCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_booking = await crud_pet_cab.create(db, booking_in=booking_in, user_id=current_user.id)

    # Email notification to user
    email_content = f"""
    <h2>Pet Cab Booking Confirmed</h2>
    <p>Dear {booking_in.owner_name},</p>
    <p>Your pet cab booking (ID: {db_booking.id}) has been successfully created and is currently <b>Pending</b> admin assignment.</p>
    <p><b>Pickup:</b> {booking_in.pickup_location}<br/>
    <b>Drop:</b> {booking_in.drop_location}<br/>
    <b>Date & Time:</b> {booking_in.pickup_date} at {booking_in.pickup_time}</p>
    <p>You will receive further updates via email once a driver is assigned or the status changes.</p>
    """
    background_tasks.add_task(
        send_pet_cab_status_email_background,
        current_user.phone_or_email,
        "Pet Cab Booking Confirmed - PashuVaani",
        email_content
    )

    # Slack notification to Admin team
    await send_pet_cab_slack_notification(db_booking.id, booking_in, current_user.phone_or_email)

    return db_booking


@router.get("", response_model=List[PetCabBookingResponse])
async def get_pet_cab_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud_pet_cab.get_multi_by_user(db, user_id=current_user.id)


# Admin Endpoints
@router.get("/admin", response_model=List[PetCabBookingResponse])
async def admin_get_pet_cab_bookings(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return await crud_pet_cab.get_all(db)

@router.put("/admin/{booking_id}", response_model=PetCabBookingResponse)
async def admin_update_pet_cab_booking(
    booking_id: str,
    update_in: PetCabBookingUpdate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    db_booking = await crud_pet_cab.get_by_id(db, id=booking_id)
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    db_booking = await crud_pet_cab.update(db, db_obj=db_booking, update_in=update_in)
    
    if update_in.status or update_in.driver_details:
        subject = f"Pet Cab Update: {db_booking.status} - PashuVaani"
        email_content = f"""
        <h2>Pet Cab Booking Status Update</h2>
        <p>Dear {db_booking.owner_name},</p>
        <p>The status of your pet cab booking (ID: {db_booking.id}) has been updated to <b>{db_booking.status}</b>.</p>
        """
        
        if db_booking.driver_details:
            email_content += f"<p><b>Driver & Cab Details:</b><br/>{db_booking.driver_details}</p>"
            
        if db_booking.status.lower() == "cancelled":
            email_content += "<p>We apologize for the inconvenience. Please contact support if you have any questions.</p>"
            
        background_tasks.add_task(
            send_pet_cab_status_email_background,
            db_booking.user.phone_or_email,
            subject,
            email_content
        )
        
    return db_booking
