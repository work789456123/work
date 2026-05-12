"""Telegram Webhook Endpoint."""

import logging
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from telegram import Bot, Update

from app.core.config import settings
from app.db.session import get_db
from app.services.telegram_bot import handle_telegram_update

logger = logging.getLogger(__name__)

router = APIRouter()
bot = Bot(token=settings.TELEGRAM_BOT_TOKEN) if settings.TELEGRAM_BOT_TOKEN else None

@router.post("/webhook")
async def telegram_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    if not bot:
        return {"status": "bot_not_configured"}
        
    try:
        data = await request.json()
        update = Update.de_json(data, bot)
        await handle_telegram_update(db, update, bot)
    except Exception as e:
        logger.error(f"Telegram Webhook Error: {e}")
        
    return {"status": "ok"}

@router.get("/setup")
async def setup_webhook(request: Request):
    """Call this once to register the webhook URL with Telegram."""
    if not bot:
        return {"status": "bot_not_configured"}
        
    # Force HTTPS because Telegram requires it, even if internal request is HTTP
    base_url = str(request.base_url).rstrip("/")
    if base_url.startswith("http://"):
        base_url = base_url.replace("http://", "https://", 1)
        
    webhook_url = f"{base_url}/api/telegram/webhook"
    
    success = await bot.set_webhook(url=webhook_url)
    return {"status": "success" if success else "failed", "url": webhook_url}
