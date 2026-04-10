import datetime
from sqlalchemy import Column, DateTime, Integer, String, Text
from app.db.base_class import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    image1 = Column(String, nullable=True)
    image2 = Column(String, nullable=True)
    contact = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)