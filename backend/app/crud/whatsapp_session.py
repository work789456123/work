"""CRUD operations for WhatsApp conversation sessions."""

import json
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.whatsapp_session import WhatsAppSession


class CRUDWhatsAppSession:
    async def get_by_phone(self, db: AsyncSession, phone_number: str) -> WhatsAppSession | None:
        result = await db.execute(
            select(WhatsAppSession).where(WhatsAppSession.phone_number == phone_number)
        )
        return result.scalars().first()

    async def create(self, db: AsyncSession, phone_number: str, user_id: str | None = None) -> WhatsAppSession:
        session = WhatsAppSession(
            phone_number=phone_number,
            user_id=user_id,
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session

    async def get_or_create(self, db: AsyncSession, phone_number: str, user_id: str | None = None) -> WhatsAppSession:
        session = await self.get_by_phone(db, phone_number)
        if not session:
            session = await self.create(db, phone_number, user_id=user_id)
        return session

    async def update_state(
        self,
        db: AsyncSession,
        session: WhatsAppSession,
        state: str,
        state_data: dict | None = None,
    ) -> WhatsAppSession:
        session.state = state
        if state_data is not None:
            session.state_data = json.dumps(state_data, ensure_ascii=False)
        session.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(session)
        return session

    async def set_language(self, db: AsyncSession, session: WhatsAppSession, language: str) -> None:
        session.language = language
        await db.commit()

    async def set_user_id(self, db: AsyncSession, session: WhatsAppSession, user_id: str) -> None:
        session.user_id = user_id
        await db.commit()

    async def append_chat_history(
        self,
        db: AsyncSession,
        session: WhatsAppSession,
        role: str,
        content: str,
        max_messages: int = 20,
    ) -> None:
        """Append a message to the session's chat history, keeping only the last N."""
        history = json.loads(session.chat_history or "[]")
        history.append({"role": role, "content": content})
        # Keep only the last N messages for context
        if len(history) > max_messages:
            history = history[-max_messages:]
        session.chat_history = json.dumps(history, ensure_ascii=False)
        session.updated_at = datetime.utcnow()
        await db.commit()

    def get_chat_history(self, session: WhatsAppSession) -> list[dict]:
        return json.loads(session.chat_history or "[]")

    def get_state_data(self, session: WhatsAppSession) -> dict:
        return json.loads(session.state_data or "{}")

    async def reset(self, db: AsyncSession, session: WhatsAppSession) -> WhatsAppSession:
        """Reset session to idle state, clear temporary booking data."""
        session.state = "idle"
        session.state_data = "{}"
        session.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(session)
        return session


crud_whatsapp_session = CRUDWhatsAppSession()
