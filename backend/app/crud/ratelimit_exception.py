from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.ratelimit_exception import RatelimitException
from app.schemas.ratelimit_exception import RatelimitExceptionCreate
from typing import List, Optional

class CRUDRatelimitException:
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[RatelimitException]:
        result = await db.execute(select(RatelimitException).where(RatelimitException.email == email))
        return result.scalars().first()

    async def get_multi(self, db: AsyncSession, skip: int = 0, limit: int = 100) -> List[RatelimitException]:
        result = await db.execute(select(RatelimitException).offset(skip).limit(limit))
        return result.scalars().all()

    async def create(self, db: AsyncSession, obj_in: RatelimitExceptionCreate) -> RatelimitException:
        db_obj = RatelimitException(
            email=obj_in.email,
            reason=obj_in.reason
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, id: str) -> Optional[RatelimitException]:
        result = await db.execute(select(RatelimitException).where(RatelimitException.id == id))
        obj = result.scalars().first()
        if obj:
            db.delete(obj)
            await db.commit()
        return obj

    async def is_exempt(self, db: AsyncSession, email: str) -> bool:
        if not email:
            return False
        obj = await self.get_by_email(db, email)
        return obj is not None

crud_ratelimit_exception = CRUDRatelimitException()
