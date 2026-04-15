from typing import List

from fastapi import APIRouter, Depends, File, Form, Response, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services.product_service import product_service

router = APIRouter()


@router.post("", response_model=ProductResponse)
async def create_product(
    category: str = Form(...),
    name: str = Form(...),
    description: str | None = Form(default=None),
    image1: UploadFile | None = File(default=None),
    image2: UploadFile | None = File(default=None),
    contact: str = Form(...),
    db: AsyncSession = Depends(get_db),
):
    payload = ProductCreate(
        category=category,
        name=name,
        description=description,
        contact=contact,
    )

    return await product_service.create_product(
        db,
        category=payload.category,
        name=payload.name,
        description=payload.description,
        image1=image1,
        image2=image2,
        contact=payload.contact,
    )


@router.get("", response_model=List[ProductResponse])
async def get_products(db: AsyncSession = Depends(get_db)):
    return await product_service.list_products(db)


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    return await product_service.get_product_or_404(db, product_id)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    category: str | None = Form(default=None),
    name: str | None = Form(default=None),
    description: str | None = Form(default=None),
    image1: UploadFile | None = File(default=None),
    image2: UploadFile | None = File(default=None),
    contact: str | None = Form(default=None),
    db: AsyncSession = Depends(get_db),
):
    payload = ProductUpdate(
        category=category,
        name=name,
        description=description,
        contact=contact,
    )
    return await product_service.update_product(
        db,
        product_id=product_id,
        category=payload.category,
        name=payload.name,
        description=payload.description,
        image1=image1,
        image2=image2,
        contact=payload.contact,
    )


@router.delete("/{product_id}", status_code=204)
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    await product_service.delete_product(db, product_id=product_id)
    return Response(status_code=204)