from datetime import datetime, timedelta
from jose import jwt
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.user import UserRegister, UserLogin, UserResponse, CreditPurchase
from app.crud.user import crud_user, pwd_context
from app.api.dependencies import get_current_user
from app.core.config import settings

router = APIRouter()

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/register")
async def register(user_in: UserRegister, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=user_in.phone_or_email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system."
        )
    user = await crud_user.create(db, user_in=user_in, role=user_in.role if hasattr(user_in, 'role') else "user")
    
    # Generate token
    token_data = {"sub": user.id, "email": user.phone_or_email, "role": user.role}
    token = create_access_token(token_data)
    
    return {"access_token": token, "user": {"id": user.id, "full_name": user.full_name, "role": user.role}}

@router.post("/login")
async def login(user_in: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=user_in.phone_or_email)
    if not user or not pwd_context.verify(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    token_data = {"sub": user.id, "email": user.phone_or_email, "role": user.role}
    token = create_access_token(token_data)
    
    return {"token": token, "user": {"id": user.id, "full_name": user.full_name, "role": user.role}}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user = Depends(get_current_user)):
    return current_user

