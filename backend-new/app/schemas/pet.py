from pydantic import BaseModel
from typing import Optional

class PetCreate(BaseModel):
    name: str
    pet_type: str
    age: Optional[str] = None
    gender: Optional[str] = None
    weight: Optional[str] = None

class PetResponse(PetCreate):
    id: str
    user_id: str
    
    class Config:
        from_attributes = True
