from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.crud.user import crud_user
from app.schemas.user import CreditPurchase

router = APIRouter()

@router.get("/balance")
async def get_credit_balance(current_user = Depends(get_current_user)):
    return {
        "credits": current_user.credits_remaining,
        "daily_count": current_user.daily_message_count,
        "daily_limit": 10,
        "has_subscription": current_user.has_subscription,
        "can_chat": current_user.has_subscription or current_user.daily_message_count < 10
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
