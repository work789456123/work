"""WhatsApp Cloud API webhook — receives and processes incoming messages.

Meta sends two types of requests:
  GET  /api/whatsapp/webhook  — verification challenge (one-time setup)
  POST /api/whatsapp/webhook  — incoming messages, status updates, etc.
"""

import logging

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import PlainTextResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from app.services.whatsapp_bot import handle_message

logger = logging.getLogger(__name__)

router = APIRouter()


# ──────────────────────────────────────────────────────────────────────────────
# GET — Meta webhook verification
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/webhook")
async def verify_webhook(
    request: Request,
):
    """Meta sends a GET request with hub.mode, hub.verify_token, and hub.challenge.
    We must return the challenge value if the verify_token matches ours."""
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    logger.info("WhatsApp webhook verification: mode=%s, token=%s", mode, token)

    if mode == "subscribe" and token == settings.WHATSAPP_VERIFY_TOKEN:
        logger.info("WhatsApp webhook verified successfully!")
        return PlainTextResponse(content=challenge, status_code=200)

    logger.warning("WhatsApp webhook verification failed — token mismatch")
    return PlainTextResponse(content="Forbidden", status_code=403)


# ──────────────────────────────────────────────────────────────────────────────
# POST — Incoming messages
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/webhook")
async def receive_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Process incoming WhatsApp messages from the Meta Cloud API."""
    try:
        body = await request.json()
    except Exception:
        return {"status": "ok"}

    # Meta sends a structured payload — extract message(s)
    entries = body.get("entry", [])
    for entry in entries:
        changes = entry.get("changes", [])
        for change in changes:
            value = change.get("value", {})
            messages = value.get("messages", [])

            for msg in messages:
                phone_number = msg.get("from", "")
                message_id = msg.get("id", "")
                msg_type = msg.get("type", "")

                # Extract text from different message types
                text = ""
                if msg_type == "text":
                    text = msg.get("text", {}).get("body", "")
                elif msg_type == "interactive":
                    # Button reply or list reply
                    interactive = msg.get("interactive", {})
                    interactive_type = interactive.get("type", "")
                    if interactive_type == "button_reply":
                        text = interactive.get("button_reply", {}).get("id", "")
                    elif interactive_type == "list_reply":
                        text = interactive.get("list_reply", {}).get("id", "")
                elif msg_type == "button":
                    # Quick reply button (from template messages)
                    text = msg.get("button", {}).get("text", "")

                if not text or not phone_number:
                    continue

                logger.info(
                    "WhatsApp message from %s (type=%s): %s",
                    phone_number,
                    msg_type,
                    text[:100],
                )

                try:
                    await handle_message(db, phone_number, text, message_id)
                except Exception as exc:
                    logger.error(
                        "Error handling WhatsApp message from %s: %s",
                        phone_number,
                        exc,
                        exc_info=True,
                    )

    # Meta expects a 200 response — anything else causes retries
    return {"status": "ok"}
