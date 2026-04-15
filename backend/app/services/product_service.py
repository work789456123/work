import shutil
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.crud.product import crud_product
from app.models.products import Product


class ProductService:
    def __init__(self) -> None:
        self.upload_dir = Path("uploads/products")
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def save_image(self, file: UploadFile | None) -> str | None:
        if file is None or file.filename is None or file.filename.strip() == "":
            return None

        ext = Path(file.filename).suffix.lower()
        unique_name = f"{uuid4().hex}{ext}"
        image_path = self.upload_dir / unique_name

        with image_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        relative_url = f"/uploads/products/{unique_name}"
        return f"{settings.BACKEND_PUBLIC_URL.rstrip('/')}{relative_url}"

    def delete_image_by_url(self, image_url: str | None) -> None:
        if not image_url:
            return
        normalized = image_url.split("/uploads/products/")[-1]
        image_name = normalized.split("?")[0]
        if image_name == "":
            return
        image_path = self.upload_dir / image_name
        if image_path.exists():
            image_path.unlink()

    async def create_product(
        self,
        db: AsyncSession,
        *,
        category: str,
        name: str,
        description: str | None,
        image1: UploadFile | None,
        image2: UploadFile | None,
        contact: str,
    ) -> Product:
        image1_url = await self.save_image(image1)
        image2_url = await self.save_image(image2)
        return await crud_product.create(
            db,
            category=category,
            name=name,
            description=description,
            image1=image1_url,
            image2=image2_url,
            contact=contact,
        )

    async def list_products(self, db: AsyncSession) -> list[Product]:
        return await crud_product.get_multi(db)

    async def get_product_or_404(self, db: AsyncSession, product_id: int) -> Product:
        product = await crud_product.get(db, product_id)
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product

    async def update_product(
        self,
        db: AsyncSession,
        *,
        product_id: int,
        category: str | None,
        name: str | None,
        description: str | None,
        image1: UploadFile | None,
        image2: UploadFile | None,
        contact: str | None,
    ) -> Product:
        product = await self.get_product_or_404(db, product_id)
        update_image1 = image1 is not None and image1.filename is not None and image1.filename != ""
        update_image2 = image2 is not None and image2.filename is not None and image2.filename != ""
        image1_url = None
        image2_url = None
        if update_image1:
            self.delete_image_by_url(product.image1)
            image1_url = await self.save_image(image1)
        if update_image2:
            self.delete_image_by_url(product.image2)
            image2_url = await self.save_image(image2)

        return await crud_product.update(
            db,
            db_obj=product,
            category=category,
            name=name,
            description=description,
            image1=image1_url,
            image2=image2_url,
            contact=contact,
            update_image1=update_image1,
            update_image2=update_image2,
        )

    async def delete_product(self, db: AsyncSession, *, product_id: int) -> None:
        product = await self.get_product_or_404(db, product_id)
        self.delete_image_by_url(product.image1)
        self.delete_image_by_url(product.image2)
        await crud_product.remove(db, db_obj=product)


product_service = ProductService()
