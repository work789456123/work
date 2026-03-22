from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.user import UserRegister


import bcrypt

class PasswordContext:
    def hash(self, password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify(self, password: str, hashed_password: str) -> bool:
        try:
            return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
        except Exception:
            return False

pwd_context = PasswordContext()

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
            role=role,
            is_verified=True
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

    async def is_device_banned(self, db: AsyncSession, device_id: str) -> bool:
        """Check if a device ID is in the banned list."""
        from app.models.banned_device import BannedDevice
        if not device_id:
            return False
        result = await db.execute(select(BannedDevice).where(BannedDevice.device_id == device_id))
        return result.scalars().first() is not None

    async def ban_device(self, db: AsyncSession, device_id: str, ip: str = None, reason: str = "Daily limit reached"):
        """Add a device to the banned list."""
        from app.models.banned_device import BannedDevice
        # Check if already banned to avoid unique constraint error
        if await self.is_device_banned(db, device_id):
            return
            
        db_obj = BannedDevice(device_id=device_id, ip_address=ip, reason=reason)
        db.add(db_obj)
        await db.commit()

    async def get_device_hash(self, ip: str, user_agent: str) -> str:
        import hashlib
        user_agent = user_agent or "unknown"
        ip = ip or "unknown"
        raw = f"{ip}-{user_agent}"
        return hashlib.sha256(raw.encode()).hexdigest()

    async def increment_daily_count(self, db: AsyncSession, user: User, ip: str = None, user_agent: str = None) -> bool:
        """Increment daily count based on user primarily, and device secondarily. Return True if limit not reached."""
        from datetime import datetime
        from app.models.device_usage import DeviceUsage
        now = datetime.utcnow()
        
        device_hash = await self.get_device_hash(ip, user_agent)

        result = await db.execute(select(DeviceUsage).where(DeviceUsage.device_hash == device_hash))
        device_usage = result.scalars().first()
        
        if not device_usage:
            device_usage = DeviceUsage(device_hash=device_hash, ip_address=ip, user_agent=user_agent)
            db.add(device_usage)
            await db.commit()
            await db.refresh(device_usage)

        # Reset counts if it's a new day
        if not device_usage.last_message_at or device_usage.last_message_at.date() < now.date():
            device_usage.daily_message_count = 0
            
        if not user.last_message_at or user.last_message_at.date() < now.date():
            user.daily_message_count = 0
            
        # Check if user is exempt from rate limits
        from app.crud.ratelimit_exception import crud_ratelimit_exception
        is_exempt = await crud_ratelimit_exception.is_exempt(db, user.phone_or_email)
        
        if is_exempt:
            # Still track usage for analytics, but never return False or ban
            device_usage.daily_message_count += 1
            device_usage.last_message_at = now
            user.daily_message_count += 1
            user.last_message_at = now
            await db.commit()
            return True

        # Per-User check (Primary)
        if not user.has_subscription and user.daily_message_count >= 10:
             return False

        # Per-Device check (Secondary safety)
        if not user.has_subscription and device_usage.daily_message_count >= 15: # slightly higher to allow some buffer
            await self.ban_device(db, device_hash, ip=ip, reason="Message limit exceed (15+ hits on single device)")
            return False
            
        device_usage.daily_message_count += 1
        device_usage.last_message_at = now
        
        # User count is the gold standard
        user.daily_message_count += 1
        user.last_message_at = now
        
        # Explicit ban check if user hits limit
        if not user.has_subscription and user.daily_message_count >= 10:
            await self.ban_device(db, device_hash, ip=ip, reason="User reached 10 message limit")

        await db.commit()
        await db.refresh(user)
        return True


crud_user = CRUDUser()
