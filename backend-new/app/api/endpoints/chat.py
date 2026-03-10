from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.chat import ChatMessage as ChatMessageSchema
from app.crud.chat import crud_chat
from app.crud.user import crud_user
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.ai_chat_service import ai_chat_service_impl

router = APIRouter()

@router.post("")
async def chat_with_gopu(
    chat_in: ChatMessageSchema,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Credit/Daily Limit check
    can_proceed = await crud_user.increment_daily_count(db, user=current_user)
    if not can_proceed:
         return {
             "response": "You've used your free messages for today. Please explore our PashuCare Suraksha Plan for unlimited guidance.",
             "limit_reached": True,
             "remaining": 0
         }

    # Load or Create session
    if not chat_in.session_id:
        chat_session = await crud_chat.create_session(db, user_id=current_user.id)
        session_id = chat_session.id
    else:
        chat_session = await crud_chat.get_session(db, session_id=chat_in.session_id)
        if not chat_session or chat_session.user_id != current_user.id:
            raise HTTPException(status_code=404, detail="Chat session not found")
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
