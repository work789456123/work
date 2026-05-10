import datetime
from typing import List, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.chat import ChatMessage, ChatSession


class CRUDChat:
    async def create_session(self, db: AsyncSession, user_id: str) -> ChatSession:
        db_obj = ChatSession(user_id=user_id, updated_at=datetime.datetime.utcnow())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_session(self, db: AsyncSession, session_id: str) -> Optional[ChatSession]:
        result = await db.execute(select(ChatSession).where(ChatSession.id == session_id))
        return result.scalars().first()

    async def get_latest_session_for_user(
        self, db: AsyncSession, user_id: str
    ) -> Optional[ChatSession]:
        result = await db.execute(
            select(ChatSession)
            .where(ChatSession.user_id == user_id)
            .order_by(ChatSession.created_at.desc())
        )
        return result.scalars().first()

    async def get_sessions_for_user(
        self, db: AsyncSession, user_id: str
    ) -> List[ChatSession]:
        result = await db.execute(
            select(ChatSession)
            .where(ChatSession.user_id == user_id)
            .order_by(ChatSession.created_at.desc())
        )
        return list(result.scalars().all())

    async def delete_session(self, db: AsyncSession, session_id: str) -> bool:
        session = await self.get_session(db, session_id)
        if not session:
            return False
        await db.delete(session)
        await db.commit()
        return True

    async def add_message(
        self,
        db: AsyncSession,
        session_id: str,
        role: str,
        content: str,
        severity: Optional[str] = None,
    ) -> ChatMessage:
        db_obj = ChatMessage(
            session_id=session_id, role=role, content=content, severity=severity
        )
        db.add(db_obj)
        # Touch the session's updated_at so the session list stays fresh
        await db.execute(
            ChatSession.__table__.update()
            .where(ChatSession.id == session_id)
            .values(updated_at=datetime.datetime.utcnow())
        )
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_messages(
        self, db: AsyncSession, session_id: str
    ) -> List[ChatMessage]:
        result = await db.execute(
            select(ChatMessage)
            .where(ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
        )
        return list(result.scalars().all())

    async def update_session_meta(
        self,
        db: AsyncSession,
        session_id: str,
        title: Optional[str] = None,
        summary: Optional[str] = None,
    ) -> None:
        values: dict = {}
        if title is not None:
            values["title"] = title
        if summary is not None:
            values["summary"] = summary
        if not values:
            return
        await db.execute(
            ChatSession.__table__.update()
            .where(ChatSession.id == session_id)
            .values(**values)
        )
        await db.commit()

    async def count_messages(self, db: AsyncSession, session_id: str) -> int:
        result = await db.execute(
            select(ChatMessage).where(ChatMessage.session_id == session_id)
        )
        return len(result.scalars().all())


crud_chat = CRUDChat()
