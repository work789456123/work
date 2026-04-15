from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BlogCreate(BaseModel):
    title: str
    description: str
    content: str
    cover_image_url: Optional[str] = ""
    published: bool = False

class BlogResponse(BlogCreate):
    id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
