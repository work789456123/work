from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.api.dependencies import get_current_user, get_current_admin
from app.models.user import User
from app.schemas.marketplace import (
    CategoryCreate, CategoryResponse, 
    SellerCreate, SellerResponse,
    ProductCreate, ProductResponse, ProductUpdate
)
from app.services.marketplace_service import marketplace_service

router = APIRouter()

# Categories
@router.post("/categories", response_model=CategoryResponse)
async def create_category(
    category_in: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return await marketplace_service.create_category(db, obj_in=category_in)

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    return await marketplace_service.get_categories(db)

# Sellers
@router.post("/sellers", response_model=SellerResponse)
async def register_as_seller(
    seller_in: SellerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if already a seller
    existing = await marketplace_service.get_seller_by_user(db, current_user.id)
    if existing:
        raise HTTPException(status_code=400, detail="User is already registered as a seller")
    return await marketplace_service.create_seller(db, user_id=current_user.id, obj_in=seller_in)

# Products
@router.post("/products", response_model=ProductResponse)
async def create_product(
    product_in: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seller = await marketplace_service.get_seller_by_user(db, current_user.id)
    if not seller:
        raise HTTPException(status_code=403, detail="Only registered sellers can create products")
    return await marketplace_service.create_product(db, seller_id=seller.id, obj_in=product_in)

@router.get("/products", response_model=List[ProductResponse])
async def list_products(
    category_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    return await marketplace_service.list_products(db, category_id=category_id)

@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seller = await marketplace_service.get_seller_by_user(db, current_user.id)
    if not seller:
        raise HTTPException(status_code=403, detail="Not authorized")

    product = await marketplace_service.update_product_for_seller(
        db, seller_id=seller.id, product_id=product_id, obj_in=product_in
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    seller = await marketplace_service.get_seller_by_user(db, current_user.id)
    if not seller:
        raise HTTPException(status_code=403, detail="Not authorized")
    deleted = await marketplace_service.delete_product_for_seller(db, seller_id=seller.id, product_id=product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return None
