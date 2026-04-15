from fastapi import APIRouter, Depends, HTTPException, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.chat import ChatMessage as ChatMessageSchema
from app.crud.chat import crud_chat
from app.crud.user import crud_user
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.ai_chat_service import ai_chat_service_impl

router = APIRouter()

@router.get("/sessions")
async def get_user_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = await crud_chat.get_sessions_for_user(db, user_id=current_user.id)
    return {
        "sessions": [
            {
                "id": session.id,
                "created_at": session.created_at
            } for session in sessions
        ]
    }

@router.get("/history")
async def get_latest_chat_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = await crud_chat.get_latest_session_for_user(db, user_id=current_user.id)
    if not session:
        return {"session_id": None, "messages": []}
    
    messages = await crud_chat.get_messages(db, session_id=session.id)
    return {
        "session_id": session.id,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at
            } for msg in messages
        ]
    }

@router.get("/sessions/{session_id}/history")
async def get_chat_history_by_session(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = await crud_chat.get_session(db, session_id=session_id)
    if not session or session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")
    
    messages = await crud_chat.get_messages(db, session_id=session.id)
    return {
        "session_id": session.id,
        "messages": [
            {
                "id": msg.id,
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at
            } for msg in messages
        ]
    }

@router.post("/sessions/new")
async def create_new_session(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    session = await crud_chat.create_session(db, user_id=current_user.id)
    return {"session_id": session.id, "created_at": session.created_at}

@router.post("")
async def chat_with_gopu(
    chat_in: ChatMessageSchema,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "unknown")
    device_hash = await crud_user.get_device_hash(client_ip, user_agent)
    
    # Check if user is exempt from rate limits
    from app.crud.ratelimit_exception import crud_ratelimit_exception
    is_exempt = await crud_ratelimit_exception.is_exempt(db, current_user.phone_or_email)

    # Check if device is banned (skip if exempt)
    if not is_exempt and await crud_user.is_device_banned(db, device_id=device_hash):
        raise HTTPException(
            status_code=403, 
            detail="PashuVaani Access Restricted: You have reached the maximum limit of free messages. Please buy our PashuCare Suraksha subscription plan to continue your chat with Gopu.AI."
        )

    # Credit/Daily Limit check
    can_proceed = await crud_user.increment_daily_count(db, user=current_user, ip=client_ip, user_agent=user_agent)
    if not can_proceed:
         raise HTTPException(
             status_code=429,
             detail="PashuVaani Daily Limit Reached: You've used your 10 free messages for today. This limit resets daily at midnight. Explore our PashuCare Suraksha Plan for unlimited guidance."
         )

    # Load or Create session
    if chat_in.session_id:
        # User provided a specific session_id — try to use it
        chat_session = await crud_chat.get_session(db, session_id=chat_in.session_id)
        if not chat_session or chat_session.user_id != current_user.id:
            chat_session = None
    else:
        chat_session = None
    
    # If no valid session found, reuse the latest session for this user
    if not chat_session:
        chat_session = await crud_chat.get_latest_session_for_user(db, user_id=current_user.id)
    
    # If user has no sessions at all, create a new one
    if not chat_session:
        chat_session = await crud_chat.create_session(db, user_id=current_user.id)
    
    session_id = chat_session.id

    # Add user message
    await crud_chat.add_message(db, session_id=session_id, role="user", content=chat_in.message)
    
    # Load recent context to pass to AI
    recent_messages = await crud_chat.get_messages(db, session_id=session_id)
    history_context = recent_messages[-10:] if len(recent_messages) > 10 else recent_messages

    # Pass to OpenAI Service
    ai_response_dict = await ai_chat_service_impl.get_response(
        user_message=chat_in.message,
        image_base64=chat_in.image_base64,
        chat_history=history_context
    )
    
    # Add assistant response to DB
    await crud_chat.add_message(
        db,
        session_id=session_id,
        role="assistant",
        content=ai_response_dict["response"],
        severity=ai_response_dict.get("severity", "info")
    )
    
    remaining = max(0, 10 - current_user.daily_message_count)
    
    return {
        "response": ai_response_dict["response"],
        "severity": ai_response_dict.get("severity", "info"),
        "session_id": session_id,
        "credits_remaining": current_user.credits_remaining,
        "remaining": remaining,
        "credits_warning": not current_user.has_subscription and remaining <= 2
    }
