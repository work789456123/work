from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.products import Product


class CRUDProduct:
    async def create(
        self,
        db: AsyncSession,
        *,
        category: str,
        name: str,
        description: str | None,
        image1: str | None,
        image2: str | None,
        contact: str,
    ) -> Product:
        db_obj = Product(
            category=category,
            name=name,
            description=description,
            image1=image1,
            image2=image2,
            contact=contact,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi(self, db: AsyncSession) -> list[Product]:
        result = await db.execute(select(Product).order_by(Product.created_at.desc()))
        return list(result.scalars().all())

    async def get(self, db: AsyncSession, product_id: int) -> Product | None:
        result = await db.execute(select(Product).where(Product.id == product_id))
        return result.scalars().first()

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: Product,
        category: str | None = None,
        name: str | None = None,
        description: str | None = None,
        image1: str | None = None,
        image2: str | None = None,
        contact: str | None = None,
        update_image1: bool = False,
        update_image2: bool = False,
    ) -> Product:
        if category is not None:
            db_obj.category = category
        if name is not None:
            db_obj.name = name
        if description is not None:
            db_obj.description = description
        if contact is not None:
            db_obj.contact = contact
        if update_image1:
            db_obj.image1 = image1
        if update_image2:
            db_obj.image2 = image2
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def remove(self, db: AsyncSession, *, db_obj: Product) -> None:
        await db.delete(db_obj)
        await db.commit()


crud_product = CRUDProduct()