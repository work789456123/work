from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from app.models.marketplace import Category, Seller, Cart, CartItem, Order, OrderItem
from app.models.products import Product
from app.schemas.marketplace import CategoryCreate, SellerCreate, ProductCreate, ProductUpdate

class MarketplaceService:
    # Category CRUD
    async def create_category(self, db: AsyncSession, obj_in: CategoryCreate) -> Category:
        db_obj = Category(**obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_categories(self, db: AsyncSession) -> List[Category]:
        result = await db.execute(select(Category).where(Category.is_deleted == False))
        return result.scalars().all()

    # Seller CRUD
    async def create_seller(self, db: AsyncSession, user_id: str, obj_in: SellerCreate) -> Seller:
        db_obj = Seller(user_id=user_id, **obj_in.model_dump())
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_seller_by_user(self, db: AsyncSession, user_id: str) -> Optional[Seller]:
        result = await db.execute(select(Seller).where(Seller.user_id == user_id, Seller.is_deleted == False))
        return result.scalar_one_or_none()

    # Product CRUD (Marketplace specific)
    async def create_product(self, db: AsyncSession, seller_id: str, obj_in: ProductCreate) -> Product:
        data = obj_in.model_dump()
        data.pop("seller_id", None)
        db_obj = Product(seller_id=seller_id, **data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def list_products(self, db: AsyncSession, category_id: Optional[str] = None) -> List[Product]:
        query = select(Product).where(Product.is_deleted == False)
        if category_id:
            query = query.where(Product.category_id == category_id)
        result = await db.execute(query)
        return result.scalars().all()

    async def update_product(self, db: AsyncSession, product_id: str, obj_in: ProductUpdate) -> Optional[Product]:
        update_data = obj_in.model_dump(exclude_unset=True)
        query = update(Product).where(Product.id == product_id).values(**update_data).returning(Product)
        result = await db.execute(query)
        await db.commit()
        return result.scalar_one_or_none()

    async def delete_product(self, db: AsyncSession, product_id: str):
        query = update(Product).where(Product.id == product_id).values(is_deleted=True)
        await db.execute(query)
        await db.commit()

marketplace_service = MarketplaceService()
