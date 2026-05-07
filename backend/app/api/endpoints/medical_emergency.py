from typing import List
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import text
from app.db.session import get_db
from app.api.dependencies import get_current_admin, get_current_user
from app.models.medical_emergency import MedicalEmergency
from app.schemas.admin_data import MedicalEmergencyCreate, MedicalEmergencyResponse
from app.core.config import settings

router = APIRouter()

async def send_slack_notification(mobile_number: str, description: str):
    if not settings.SLACK_WEBHOOK_URL_EMERGENCIES:
        return
    
    payload = {
        "text": "🚨 *New Medical Emergency Reported!*",
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "🚨 *New Medical Emergency Reported!*"
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": f"*Phone Number:*\n{mobile_number}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": f"*Status:*\nPending"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"*Description:*\n{description}"
                }
            }
        ]
    }
    
    try:
        async with httpx.AsyncClient() as client:
            await client.post(settings.SLACK_WEBHOOK_URL_EMERGENCIES, json=payload)
    except Exception as e:
        print(f"Failed to send Slack notification: {e}")

@router.post("", response_model=MedicalEmergencyResponse)
async def create_medical_emergency(
    emergency_in: MedicalEmergencyCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_obj = MedicalEmergency(
        mobile_number=emergency_in.mobile_number,
        description=emergency_in.description,
        user_id=current_user.id,
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    await send_slack_notification(db_obj.mobile_number, db_obj.description)
    return db_obj

@router.get("/me", response_model=List[MedicalEmergencyResponse])
async def get_my_medical_emergencies(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Fetch emergencies for the current user by user_id."""
    result = await db.execute(
        select(MedicalEmergency)
        .where(MedicalEmergency.user_id == current_user.id)
        .order_by(MedicalEmergency.created_at.desc())
    )
    return result.scalars().all()

@router.get("", response_model=List[MedicalEmergencyResponse])
async def get_medical_emergencies(
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    result = await db.execute(select(MedicalEmergency).order_by(MedicalEmergency.created_at.desc()))
    return result.scalars().all()

@router.put("/{emergency_id}/resolve", response_model=MedicalEmergencyResponse)
async def resolve_medical_emergency(
    emergency_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    result = await db.execute(select(MedicalEmergency).where(MedicalEmergency.id == emergency_id))
    emergency = result.scalars().first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Medical emergency not found")
    emergency.status = "resolved"
    await db.commit()
    await db.refresh(emergency)
    return emergency
