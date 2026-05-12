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
        if not settings.USE_S3:
            self.upload_dir.mkdir(parents=True, exist_ok=True)
        
        self.s3_client = None
        if settings.USE_S3:
            import boto3
            self.s3_client = boto3.client(
                "s3",
                aws_access_key_id=settings.S3_ACCESS_KEY,
                aws_secret_access_key=settings.S3_SECRET_KEY,
                region_name=settings.S3_REGION
            )

    async def save_image(self, file: UploadFile | None) -> str | None:
        if file is None or file.filename is None or file.filename.strip() == "":
            return None

        import re
        ext = Path(file.filename).suffix.lower()
        base_name = Path(file.filename).stem
        safe_name = re.sub(r'[^a-z0-9]+', '-', base_name.lower()).strip('-')
        if not safe_name:
            safe_name = uuid4().hex

        unique_name = f"{safe_name}{ext}"
        
        if settings.USE_S3:
            try:
                # Upload to S3
                key = f"products/{unique_name}"
                self.s3_client.upload_fileobj(
                    file.file,
                    settings.S3_BUCKET,
                    key,
                    ExtraArgs={"ContentType": file.content_type}
                )
                
                if settings.S3_CUSTOM_DOMAIN:
                    return f"https://{settings.S3_CUSTOM_DOMAIN}/{key}"
                else:
                    return f"https://{settings.S3_BUCKET}.s3.{settings.S3_REGION}.amazonaws.com/{key}"
            except Exception as e:
                import logging
                logging.error(f"S3 upload failed: {e}")
                raise HTTPException(status_code=500, detail="Could not upload image to cloud storage")
        else:
            # Local storage
            image_path = self.upload_dir / unique_name
            with image_path.open("wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            return f"/uploads/products/{unique_name}"

    def delete_image_by_url(self, image_url: str | None) -> None:
        if not image_url:
            return
            
        if settings.USE_S3:
            try:
                # Extract key from URL
                # Assumes key starts after the domain
                if settings.S3_CUSTOM_DOMAIN:
                    key = image_url.split(f"{settings.S3_CUSTOM_DOMAIN}/")[-1]
                else:
                    key = image_url.split(".amazonaws.com/")[-1]
                
                self.s3_client.delete_object(Bucket=settings.S3_BUCKET, Key=key)
            except Exception as e:
                import logging
                logging.error(f"S3 deletion failed: {e}")
        else:
            # Local deletion
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
