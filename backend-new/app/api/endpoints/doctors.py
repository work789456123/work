from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.doctor import DoctorResponse
from app.crud.doctor import crud_doctor

router = APIRouter()

@router.get("", response_model=List[DoctorResponse])
async def get_doctors(db: AsyncSession = Depends(get_db)):
    return await crud_doctor.get_multi(db)
