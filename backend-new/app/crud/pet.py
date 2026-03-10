from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.pet import Pet
from app.schemas.pet import PetCreate

class CRUDPet:
    async def create(self, db: AsyncSession, pet_in: PetCreate, user_id: str) -> Pet:
        db_obj = Pet(
            user_id=user_id,
            name=pet_in.name,
            pet_type=pet_in.pet_type,
            age=pet_in.age,
            gender=pet_in.gender,
            weight=pet_in.weight
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi_by_user(self, db: AsyncSession, user_id: str) -> List[Pet]:
        result = await db.execute(select(Pet).where(Pet.user_id == user_id))
        return list(result.scalars().all())

crud_pet = CRUDPet()
