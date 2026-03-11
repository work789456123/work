from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.models.farm import Farmer, Animal, FarmConsultation, AIAlert
from app.schemas.farm import FarmerCreate, AnimalCreate, FarmConsultationCreate, AIAlertCreate

class CRUDFarm:
    # --- Farmers ---
    async def create_farmer(self, db: AsyncSession, obj_in: FarmerCreate) -> Farmer:
        db_obj = Farmer(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_farmers(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Farmer]:
        result = await db.execute(select(Farmer).offset(skip).limit(limit))
        return list(result.scalars().all())

    # --- Animals ---
    async def create_animal(self, db: AsyncSession, obj_in: AnimalCreate) -> Animal:
        db_obj = Animal(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_animals(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Animal]:
        result = await db.execute(select(Animal).offset(skip).limit(limit))
        return list(result.scalars().all())

    # --- Consultations ---
    async def create_consultation(self, db: AsyncSession, obj_in: FarmConsultationCreate) -> FarmConsultation:
        db_obj = FarmConsultation(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_consultations(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[FarmConsultation]:
        # Joining with Animal and Farmer for convenience as seen in legacy logic
        query = select(FarmConsultation).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    # --- AI Alerts ---
    async def create_alert(self, db: AsyncSession, obj_in: AIAlertCreate) -> AIAlert:
        db_obj = AIAlert(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_alerts(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[AIAlert]:
        result = await db.execute(select(AIAlert).offset(skip).limit(limit))
        return list(result.scalars().all())

crud_farm = CRUDFarm()
