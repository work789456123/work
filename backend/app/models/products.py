import datetime
import uuid
from sqlalchemy import Column, DateTime, Integer, String, Text, ForeignKey, Numeric, Boolean
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    seller_id = Column(String, ForeignKey("sellers.id"), nullable=True) # Optional for now
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Integer, default=0)
    status = Column(String, default="ACTIVE") # ACTIVE, INACTIVE
    
    # Old fields for compatibility
    category = Column(String, nullable=True) # keeping original field for a bit
    image1 = Column(String, nullable=True)
    image2 = Column(String, nullable=True)
    contact = Column(String, nullable=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

    seller = relationship("Seller", back_populates="products")
    category_rel = relationship("Category")