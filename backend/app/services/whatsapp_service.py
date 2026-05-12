"""Send messages to WhatsApp users via Meta Cloud API."""

import logging
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

_BASE_URL = "https://graph.facebook.com"


def _api_url(path: str = "messages") -> str:
    return f"{_BASE_URL}/{settings.WHATSAPP_API_VERSION}/{settings.WHATSAPP_PHONE_NUMBER_ID}/{path}"


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }


async def _post(payload: dict[str, Any]) -> dict | None:
    """Fire-and-forget POST to Meta Cloud API."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(_api_url(), headers=_headers(), json=payload)
            if resp.status_code not in (200, 201):
                logger.error("WhatsApp API error %s: %s", resp.status_code, resp.text)
                return None
            return resp.json()
    except Exception as exc:
        logger.error("WhatsApp send failed: %s", exc)
        return None


# ──────────────────────────────────────────────────────────────────────────────
# Public helpers
# ──────────────────────────────────────────────────────────────────────────────

async def send_text(to: str, text: str) -> dict | None:
    """Send a simple text message."""
    return await _post({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "text",
        "text": {"body": text},
    })


async def send_interactive_buttons(
    to: str,
    body: str,
    buttons: list[dict[str, str]],
    header: str | None = None,
    footer: str | None = None,
) -> dict | None:
    """Send an interactive message with up to 3 reply buttons.

    Each button dict: {"id": "unique_id", "title": "Button Label"}
    """
    action_buttons = [
        {"type": "reply", "reply": {"id": b["id"], "title": b["title"][:20]}}
        for b in buttons[:3]  # WhatsApp max 3 buttons
    ]
    interactive: dict[str, Any] = {
        "type": "button",
        "body": {"text": body},
        "action": {"buttons": action_buttons},
    }
    if header:
        interactive["header"] = {"type": "text", "text": header}
    if footer:
        interactive["footer"] = {"text": footer}

    return await _post({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "interactive",
        "interactive": interactive,
    })


async def send_interactive_list(
    to: str,
    body: str,
    button_text: str,
    sections: list[dict[str, Any]],
    header: str | None = None,
    footer: str | None = None,
) -> dict | None:
    """Send an interactive list picker message.

    sections example:
    [{"title": "Morning", "rows": [{"id": "9am", "title": "9:00 AM"}, ...]}]
    """
    interactive: dict[str, Any] = {
        "type": "list",
        "body": {"text": body},
        "action": {"button": button_text[:20], "sections": sections},
    }
    if header:
        interactive["header"] = {"type": "text", "text": header}
    if footer:
        interactive["footer"] = {"text": footer}

    return await _post({
        "messaging_product": "whatsapp",
        "to": to,
        "type": "interactive",
        "interactive": interactive,
    })


async def mark_as_read(message_id: str) -> None:
    """Mark a received message as read (blue ticks)."""
    await _post({
        "messaging_product": "whatsapp",
        "status": "read",
        "message_id": message_id,
    })
