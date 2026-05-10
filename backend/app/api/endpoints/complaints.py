from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.complaint import ComplaintCreate, ComplaintResponse
from app.services.complaint_service import complaint_service

router = APIRouter()

@router.post("", response_model=ComplaintResponse)
async def create_complaint(
    complaint_in: ComplaintCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await complaint_service.create_complaint(db, user_id=current_user.id, obj_in=complaint_in)

@router.get("", response_model=List[ComplaintResponse])
async def get_my_complaints(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await complaint_service.get_user_complaints(db, user_id=current_user.id)
