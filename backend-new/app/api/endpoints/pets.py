from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.pet import PetCreate, PetResponse
from app.crud.pet import crud_pet
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("", response_model=PetResponse)
async def add_pet(
    pet_in: PetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud_pet.create(db, pet_in=pet_in, user_id=current_user.id)

@router.get("", response_model=List[PetResponse])
async def get_user_pets(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await crud_pet.get_multi_by_user(db, user_id=current_user.id)
