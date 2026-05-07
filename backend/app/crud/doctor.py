from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.doctor import Doctor

from app.schemas.doctor import DoctorCreate

class CRUDDoctor:
    async def get_multi(self, db: AsyncSession) -> List[Doctor]:
        result = await db.execute(select(Doctor))
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, *, obj_in: DoctorCreate) -> Doctor:
        db_obj = Doctor(
            name=obj_in.name,
            specialty=obj_in.specialty,
            experience=obj_in.experience,
            rating=obj_in.rating,
            reviews=obj_in.reviews,
            image=obj_in.image,
            availability=obj_in.availability,
            consultation_fee=obj_in.consultation_fee,
            languages=obj_in.languages
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

crud_doctor = CRUDDoctor()
