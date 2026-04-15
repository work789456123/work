from fastapi import APIRouter, Depends, Header, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.crud.user import crud_user
from app.schemas.user import CreditPurchase
from app.models.device_usage import DeviceUsage

router = APIRouter()

@router.get("/balance")
async def get_credit_balance(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "unknown")
    device_hash = await crud_user.get_device_hash(client_ip, user_agent)
    
    # Prioritize user's total count for logged-in users
    daily_count = current_user.daily_message_count
    
    # Check if device is banned
    is_banned = await crud_user.is_device_banned(db, device_id=device_hash)
    
    if is_banned and not current_user.has_subscription:
        daily_count = 10 # Force it to show 0 remaining

    # Check if user is exempt from rate limits
    from app.crud.ratelimit_exception import crud_ratelimit_exception
    is_exempt = await crud_ratelimit_exception.is_exempt(db, current_user.phone_or_email)
    
    can_chat = is_exempt or (not is_banned and (current_user.has_subscription or daily_count < 10))
    
    return {
        "credits": current_user.credits_remaining,
        "daily_count": daily_count,
        "daily_limit": 10,
        "has_subscription": current_user.has_subscription or is_exempt,
        "can_chat": can_chat,
        "is_exempt": is_exempt
    }

@router.post("/purchase")
async def purchase_credits(
    purchase: CreditPurchase,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    user = await crud_user.purchase_plan(db, user=current_user, plan_type=purchase.plan_type)
    return {
        "message": f"Successfully upgraded to {purchase.plan_type} plan",
        "credits": user.credits_remaining,
        "hasSubscription": user.has_subscription
    }
