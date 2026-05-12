from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.models.pet_cab import PetCabBooking
from app.schemas.pet_cab import PetCabBookingCreate, PetCabBookingUpdate

class CRUDPetCabBooking:
    async def create(self, db: AsyncSession, booking_in: PetCabBookingCreate, user_id: str) -> PetCabBooking:
        db_obj = PetCabBooking(
            user_id=user_id,
            **booking_in.model_dump()
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi_by_user(self, db: AsyncSession, user_id: str) -> List[PetCabBooking]:
        result = await db.execute(
            select(PetCabBooking)
            .where(PetCabBooking.user_id == user_id)
            .order_by(PetCabBooking.id.desc())
        )
        return list(result.scalars().all())
        
    async def get_all(self, db: AsyncSession) -> List[PetCabBooking]:
        result = await db.execute(
            select(PetCabBooking)
            .options(joinedload(PetCabBooking.user))
            .order_by(PetCabBooking.id.desc())
        )
        return list(result.scalars().all())

    async def get_by_id(self, db: AsyncSession, id: str) -> PetCabBooking | None:
        result = await db.execute(
            select(PetCabBooking)
            .options(joinedload(PetCabBooking.user))
            .where(PetCabBooking.id == id)
        )
        return result.scalars().first()
        
    async def update(self, db: AsyncSession, db_obj: PetCabBooking, update_in: PetCabBookingUpdate) -> PetCabBooking:
        update_data = update_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

crud_pet_cab = CRUDPetCabBooking()
