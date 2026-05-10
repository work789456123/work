import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.crud.chat import crud_chat
from app.crud.user import crud_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.chat import ChatMessage as ChatMessageSchema, SUMMARISE_AFTER_MESSAGES
from app.services.ai_chat_service import ai_chat_service_impl
from app.services.chat_language import normalize_ui_language

logger = logging.getLogger(__name__)

router = APIRouter()


# ---------------------------------------------------------------------------
# Background task — uses its own db session (never the request session)
# ---------------------------------------------------------------------------


async def _maybe_summarise(session_id: str, language: str) -> None:
    """Runs as a FastAPI background task.

    Opens a fresh AsyncSession so it is not racing against the closed request session.
    """
    try:
        from app.db.session import AsyncSessionLocal

        async with AsyncSessionLocal() as db:
            messages = await crud_chat.get_messages(db, session_id=session_id)
            if len(messages) < SUMMARISE_AFTER_MESSAGES:
                return
            summary = await ai_chat_service_impl.summarize_session(messages, language=language)
            if summary:
                await crud_chat.update_session_meta(db, session_id=session_id, summary=summary)
    except Exception as e:
        logger.warning("Background summarisation failed for session %s: %s", session_id, e)


# ---------------------------------------------------------------------------
# Session management endpoints
# ---------------------------------------------------------------------------


@router.get("/sessions")
async def get_user_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sessions = await crud_chat.get_sessions_for_user(db, user_id=current_user.id)
    return {
        "sessions": [
            {
                "id": s.id,
                "title": s.title,
                "summary": s.summary,
                "created_at": s.created_at,
                "updated_at": s.updated_at,
            }
            for s in sessions
        ]
    }


@router.post("/sessions/new")
async def create_new_session(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = await crud_chat.create_session(db, user_id=current_user.id)
    return {
        "session_id": session.id,
        "title": session.title,
        "created_at": session.created_at,
    }


@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = await crud_chat.get_session(db, session_id=session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")
    await crud_chat.delete_session(db, session_id=session_id)
    return {"deleted": True, "session_id": session_id}


@router.get("/sessions/{session_id}/history")
async def get_chat_history_by_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = await crud_chat.get_session(db, session_id=session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = await crud_chat.get_messages(db, session_id=session_id)
    return {
        "session_id": session.id,
        "title": session.title,
        "summary": session.summary,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "severity": m.severity,
                "created_at": m.created_at,
            }
            for m in messages
        ],
    }


@router.get("/history")
async def get_latest_chat_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = await crud_chat.get_latest_session_for_user(db, user_id=current_user.id)
    if not session:
        return {"session_id": None, "title": None, "summary": None, "messages": []}

    messages = await crud_chat.get_messages(db, session_id=session.id)
    return {
        "session_id": session.id,
        "title": session.title,
        "summary": session.summary,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "severity": m.severity,
                "created_at": m.created_at,
            }
            for m in messages
        ],
    }


# ---------------------------------------------------------------------------
# Main chat endpoint
# ---------------------------------------------------------------------------


@router.post("")
async def chat_with_gopu(
    chat_in: ChatMessageSchema,
    request: Request,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "unknown")
    device_hash = await crud_user.get_device_hash(client_ip, user_agent)

    # Rate-limit exemption check
    from app.crud.ratelimit_exception import crud_ratelimit_exception

    is_exempt = await crud_ratelimit_exception.is_exempt(db, current_user.phone_or_email)

    if not is_exempt and await crud_user.is_device_banned(db, device_id=device_hash):
        raise HTTPException(
            status_code=403,
            detail=(
                "PashuVaani Access Restricted: You have reached the maximum limit of free messages. "
                "Please buy our PashuCare Suraksha subscription plan to continue your chat with Gopu.AI."
            ),
        )

    # Check (and consume) daily quota BEFORE doing any expensive work.
    # If the AI subsequently fails, the user message is cleaned up below so the
    # quota is a fair reflection of actual conversations attempted.
    can_proceed = await crud_user.increment_daily_count(
        db, user=current_user, ip=client_ip, user_agent=user_agent
    )
    if not can_proceed:
        raise HTTPException(
            status_code=429,
            detail=(
                "PashuVaani Daily Limit Reached: You've used your 10 free messages for today. "
                "This limit resets daily at midnight. Explore our PashuCare Suraksha Plan for unlimited guidance."
            ),
        )

    # ------------------------------------------------------------------
    # Session resolution
    # ------------------------------------------------------------------
    chat_session = None

    if chat_in.session_id:
        # Caller specified a session — use it only if it belongs to this user
        candidate = await crud_chat.get_session(db, session_id=chat_in.session_id)
        if candidate and candidate.user_id == current_user.id:
            chat_session = candidate
        # If the session_id was invalid/foreign, we fall through and create a new one below
        # (do NOT silently hijack another user's latest session)

    if chat_session is None and not chat_in.session_id:
        # No session_id supplied → reuse the user's latest session for continuity
        chat_session = await crud_chat.get_latest_session_for_user(db, user_id=current_user.id)

    if chat_session is None:
        chat_session = await crud_chat.create_session(db, user_id=current_user.id)

    session_id = chat_session.id
    is_first_message = not bool(chat_session.title)

    # ------------------------------------------------------------------
    # Persist user message (will be deleted on AI failure)
    # ------------------------------------------------------------------
    user_msg_obj = await crud_chat.add_message(
        db, session_id=session_id, role="user", content=chat_in.message
    )

    # ------------------------------------------------------------------
    # Pet context injection (medical complaint mode)
    # ------------------------------------------------------------------
    pet_context: str | None = None
    if chat_in.pet_id:
        from app.crud.pet import crud_pet

        pet = await crud_pet.get_by_id(db, pet_id=chat_in.pet_id, user_id=current_user.id)
        if pet:
            parts = [f"Name: {pet.name}", f"Type: {pet.pet_type}"]
            if pet.age:
                parts.append(f"Age: {pet.age}")
            if pet.gender:
                parts.append(f"Gender: {pet.gender}")
            if pet.weight:
                parts.append(f"Weight: {pet.weight}")
            pet_context = " | ".join(parts)

    # ------------------------------------------------------------------
    # AI response — on failure, clean up the user message and raise 503
    # ------------------------------------------------------------------
    all_messages = await crud_chat.get_messages(db, session_id=session_id)
    try:
        ai_response_dict = await ai_chat_service_impl.get_response(
            user_message=chat_in.message,
            image_base64=chat_in.image_base64,
            chat_history=all_messages,
            language=chat_in.language or "Hindi",
            session_summary=chat_session.summary,
            pet_context=pet_context,
        )
    except Exception as exc:
        logger.error("AI response failed for session %s: %s", session_id, exc)
        await crud_chat.delete_message(db, message_id=user_msg_obj.id)
        raise HTTPException(
            status_code=503,
            detail="Our AI expert is currently unavailable. Please try again in a moment.",
        ) from exc

    response_text = ai_response_dict["response"]
    severity = ai_response_dict.get("severity", "low")

    # Save assistant response
    await crud_chat.add_message(
        db,
        session_id=session_id,
        role="assistant",
        content=response_text,
        severity=severity,
    )

    # ------------------------------------------------------------------
    # Session metadata: auto-title + background summarise
    # ------------------------------------------------------------------
    if is_first_message:
        title = ai_chat_service_impl.derive_session_title(chat_in.message)
        await crud_chat.update_session_meta(db, session_id=session_id, title=title)
        chat_session.title = title

    total_messages = len(all_messages) + 1
    if total_messages >= SUMMARISE_AFTER_MESSAGES and total_messages % 10 == 0:
        lang = normalize_ui_language(chat_in.language or "Hindi")
        background_tasks.add_task(_maybe_summarise, session_id, lang)

    remaining = max(0, 10 - current_user.daily_message_count)

    return {
        "response": response_text,
        "severity": severity,
        "session_id": session_id,
        "session_title": chat_session.title,
        "credits_remaining": current_user.credits_remaining,
        "remaining": remaining,
        "credits_warning": not current_user.has_subscription and remaining <= 2,
    }
