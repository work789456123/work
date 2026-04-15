from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.chat import ChatSession, ChatMessage

class CRUDChat:
    async def create_session(self, db: AsyncSession, user_id: str) -> ChatSession:
        db_obj = ChatSession(user_id=user_id)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def get_session(self, db: AsyncSession, session_id: str) -> ChatSession | None:
        result = await db.execute(select(ChatSession).where(ChatSession.id == session_id))
        return result.scalars().first()

    async def get_latest_session_for_user(self, db: AsyncSession, user_id: str) -> ChatSession | None:
        result = await db.execute(
            select(ChatSession).where(ChatSession.user_id == user_id).order_by(ChatSession.created_at.desc())
        )
        return result.scalars().first()

    async def get_sessions_for_user(self, db: AsyncSession, user_id: str) -> List[ChatSession]:
        result = await db.execute(
            select(ChatSession).where(ChatSession.user_id == user_id).order_by(ChatSession.created_at.desc())
        )
        return list(result.scalars().all())
        
    async def add_message(self, db: AsyncSession, session_id: str, role: str, content: str, severity: str = None) -> ChatMessage:
        db_obj = ChatMessage(
            session_id=session_id,
            role=role,
            content=content,
            severity=severity
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj
        
    async def get_messages(self, db: AsyncSession, session_id: str) -> List[ChatMessage]:
        result = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
        )
        return list(result.scalars().all())

crud_chat = CRUDChat()
