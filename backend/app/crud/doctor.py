from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.doctor import Doctor

class CRUDDoctor:
    async def get_multi(self, db: AsyncSession) -> List[Doctor]:
        result = await db.execute(select(Doctor))
        return list(result.scalars().all())

crud_doctor = CRUDDoctor()
