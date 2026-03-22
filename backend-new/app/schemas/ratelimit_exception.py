from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class RatelimitExceptionBase(BaseModel):
    email: EmailStr
    reason: Optional[str] = None

class RatelimitExceptionCreate(RatelimitExceptionBase):
    pass

class RatelimitException(RatelimitExceptionBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
