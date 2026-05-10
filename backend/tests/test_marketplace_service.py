import unittest
from unittest.mock import AsyncMock, MagicMock
from app.services.marketplace_service import marketplace_service
from app.schemas.marketplace import CategoryCreate, SellerCreate, ProductCreate

class TestMarketplaceService(unittest.IsolatedAsyncioTestCase):
    async def test_create_category(self):
        db = AsyncMock()
        obj_in = CategoryCreate(name="Vitamins", description="Health supplements")
        
        category = await marketplace_service.create_category(db, obj_in=obj_in)
        
        self.assertEqual(category.name, "Vitamins")
        db.add.assert_called()
        db.commit.assert_called()

    async def test_create_seller(self):
        db = AsyncMock()
        obj_in = SellerCreate(store_name="AgriStore")
        
        seller = await marketplace_service.create_seller(db, user_id="user-456", obj_in=obj_in)
        
        self.assertEqual(seller.store_name, "AgriStore")
        self.assertEqual(seller.user_id, "user-456")
        db.add.assert_called()

    async def test_create_product(self):
        db = AsyncMock()
        obj_in = ProductCreate(name="Cow Feed", price=50.0, stock_quantity=100)
        
        product = await marketplace_service.create_product(db, seller_id="seller-789", obj_in=obj_in)
        
        self.assertEqual(product.name, "Cow Feed")
        self.assertEqual(product.seller_id, "seller-789")
        db.add.assert_called()

if __name__ == "__main__":
    unittest.main()
