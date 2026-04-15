from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel

ProductCategory = Literal[
    "Feed & Fodder",
    "Health & Supplements",
    "Grooming & Care",
    "Equipment",
]


class ProductBase(BaseModel):
    category: ProductCategory
    name: str
    description: Optional[str] = None
    contact: str


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    category: Optional[ProductCategory] = None
    name: Optional[str] = None
    description: Optional[str] = None
    contact: Optional[str] = None


class ProductResponse(ProductBase):
    id: int
    image1: Optional[str] = None
    image2: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True