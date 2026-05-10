import hashlib
import hmac
import json
import time

from fastapi import APIRouter, Depends, Form, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
import httpx

from app.core.config import settings
from app.crud.appointment import crud_appointment
from app.db.session import get_db
from app.models.appointment import Appointment

router = APIRouter()


def _verify_slack_signature(body: bytes, timestamp: str, signature: str) -> bool:
    """Verify the request genuinely came from Slack."""
    if not settings.SLACK_SIGNING_SECRET:
        return True
    try:
        if abs(time.time() - int(timestamp)) > 300:
            return False
        base = f"v0:{timestamp}:{body.decode()}"
        mac = hmac.new(
            settings.SLACK_SIGNING_SECRET.encode(),
            base.encode(),
            hashlib.sha256,
        )
        expected = "v0=" + mac.hexdigest()
        return hmac.compare_digest(expected, signature)
    except Exception:
        return False


async def _post_slack_update(response_url: str, text: str, appointment_id: str, status: str):
    """Replace the original Slack message with an updated status."""
    color = "#2eb886" if status == "confirmed" else "#e01e5a"
    emoji = "✅" if status == "confirmed" else "❌"
    payload = {
        "replace_original": True,
        "blocks": [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": f"{emoji} *Appointment {status.capitalize()}*\n{text}"
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "mrkdwn",
                        "text": f"ID: `{appointment_id}` · Status updated via Slack"
                    }
                ]
            }
        ]
    }
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            await client.post(response_url, json=payload)
    except Exception:
        pass


@router.post("/interactions")
async def slack_interactions(
    request: Request,
    payload: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    # Verify signature
    timestamp = request.headers.get("X-Slack-Request-Timestamp", "0")
    signature = request.headers.get("X-Slack-Signature", "")
    body = await request.body()

    if not _verify_slack_signature(body, timestamp, signature):
        raise HTTPException(status_code=403, detail="Invalid Slack signature")

    data = json.loads(payload)

    # Only handle block_actions (button clicks)
    if data.get("type") != "block_actions":
        return {"ok": True}

    action = data["actions"][0]
    action_id = action["action_id"]
    appointment_id = action["value"]
    response_url = data.get("response_url", "")
    user_name = data.get("user", {}).get("name", "someone")

    if action_id not in ("confirm_appointment", "cancel_appointment"):
        return {"ok": True}

    new_status = "confirmed" if action_id == "confirm_appointment" else "cancelled"

    # Update in DB
    result = await db.execute(
        select(Appointment)
        .options(joinedload(Appointment.user))
        .where(Appointment.id == appointment_id)
    )
    appt = result.scalars().first()

    if not appt:
        await _post_slack_update(
            response_url,
            "⚠️ Appointment not found in database.",
            appointment_id,
            new_status,
        )
        return {"ok": True}

    if appt.status != "pending":
        await _post_slack_update(
            response_url,
            f"This appointment is already *{appt.status}*.",
            appointment_id,
            appt.status,
        )
        return {"ok": True}

    # Apply the status change
    appt.status = new_status
    await db.commit()

    owner = appt.owner_name
    pet = appt.pet_name
    slot = appt.time_slot
    user_email = appt.user.phone_or_email if appt.user else "unknown"

    summary = f"*{owner}*'s pet *{pet}* at *{slot}* (user: {user_email})\nUpdated by @{user_name}"

    await _post_slack_update(response_url, summary, appointment_id, new_status)

    return {"ok": True}
