import datetime
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_id: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: str
    created_at: datetime.datetime
    
    class Config:
        from_attributes = True

class SellerBase(BaseModel):
    store_name: str
    store_description: Optional[str] = None

class SellerCreate(SellerBase):
    pass

class SellerResponse(SellerBase):
    id: str
    user_id: str
    rating: Decimal
    
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock_quantity: Optional[int] = 0
    category_id: Optional[str] = None
    seller_id: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    category_id: Optional[str] = None

class ProductResponse(ProductBase):
    id: str
    status: str
    created_at: datetime.datetime
    
    class Config:
        from_attributes = True
