from jose import jwt, JWTError
from typing import Annotated
from datetime import datetime
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.crud.user import crud_user
from app.models.user import User
from app.core.config import settings

security = HTTPBearer()

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    token = credentials.credentials
    payload = verify_token(token)

    user_id = payload.get("sub")
    if user_id is None or user_id == "":
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    user_id = str(user_id)

    user = await crud_user.get_by_id(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    return user

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    user = await get_current_user(credentials, db)
    if user.role not in ["admin", "superadmin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return user

async def get_super_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> User:
    user = await get_current_user(credentials, db)
    if user.role != "superadmin":
        raise HTTPException(status_code=403, detail="Superadmin access required. Only the main ID can perform this action.")
    return user
