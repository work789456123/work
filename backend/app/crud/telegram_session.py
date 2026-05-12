"""CRUD operations for Telegram conversation sessions."""

import json
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.telegram_session import TelegramSession


class CRUDTelegramSession:
    async def get_by_chat_id(self, db: AsyncSession, chat_id: str) -> TelegramSession | None:
        result = await db.execute(
            select(TelegramSession).where(TelegramSession.chat_id == chat_id)
        )
        return result.scalars().first()

    async def create(self, db: AsyncSession, chat_id: str, user_id: str | None = None) -> TelegramSession:
        session = TelegramSession(
            chat_id=chat_id,
            user_id=user_id,
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session

    async def get_or_create(self, db: AsyncSession, chat_id: str, user_id: str | None = None) -> TelegramSession:
        session = await self.get_by_chat_id(db, chat_id)
        if not session:
            session = await self.create(db, chat_id, user_id=user_id)
        return session

    async def update_state(
        self,
        db: AsyncSession,
        session: TelegramSession,
        state: str,
        state_data: dict | None = None,
    ) -> TelegramSession:
        session.state = state
        if state_data is not None:
            session.state_data = json.dumps(state_data, ensure_ascii=False)
        session.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(session)
        return session

    async def set_language(self, db: AsyncSession, session: TelegramSession, language: str) -> None:
        session.language = language
        await db.commit()

    async def append_chat_history(
        self,
        db: AsyncSession,
        session: TelegramSession,
        role: str,
        content: str,
        max_messages: int = 20,
    ) -> None:
        history = json.loads(session.chat_history or "[]")
        history.append({"role": role, "content": content})
        if len(history) > max_messages:
            history = history[-max_messages:]
        session.chat_history = json.dumps(history, ensure_ascii=False)
        session.updated_at = datetime.utcnow()
        await db.commit()

    def get_chat_history(self, session: TelegramSession) -> list[dict]:
        return json.loads(session.chat_history or "[]")

    def get_state_data(self, session: TelegramSession) -> dict:
        return json.loads(session.state_data or "{}")

    async def reset(self, db: AsyncSession, session: TelegramSession) -> TelegramSession:
        session.state = "awaiting_language"
        session.state_data = "{}"
        session.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(session)
        return session


crud_telegram_session = CRUDTelegramSession()
