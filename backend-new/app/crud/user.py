from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.user import UserRegister
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class CRUDUser:
    async def get_by_phone_or_email(self, db: AsyncSession, phone_or_email: str) -> User | None:
        result = await db.execute(select(User).where(User.phone_or_email == phone_or_email))
        return result.scalars().first()
        
    async def get_by_id(self, db: AsyncSession, user_id: str) -> User | None:
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalars().first()

    async def create(self, db: AsyncSession, user_in: UserRegister, role: str = "user") -> User:
        hashed_password = pwd_context.hash(user_in.password)
        db_obj = User(
            full_name=user_in.full_name,
            phone_or_email=user_in.phone_or_email,
            hashed_password=hashed_password,
            role=role
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def update_credits(self, db: AsyncSession, user: User, credits: int) -> User:
        user.credits_remaining = credits
        await db.commit()
        await db.refresh(user)
        return user
        
    async def purchase_plan(self, db: AsyncSession, user: User, plan_type: str) -> User:
        user.has_subscription = True
        if plan_type == "monthly":
             user.credits_remaining += 100
        else:
             user.credits_remaining += 500
        await db.commit()
        await db.refresh(user)
        return user

    async def increment_daily_count(self, db: AsyncSession, user: User) -> bool:
        """Increment daily count, reset if new day. Return True if limit not reached."""
        from datetime import datetime
        now = datetime.utcnow()
        
        # Reset count if it's a new day
        if not user.last_message_at or user.last_message_at.date() < now.date():
            user.daily_message_count = 0
            
        if not user.has_subscription and user.daily_message_count >= 10:
            return False
            
        user.daily_message_count += 1
        user.last_message_at = now
        await db.commit()
        await db.refresh(user)
        return True

crud_user = CRUDUser()
