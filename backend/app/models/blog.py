import uuid
import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Text
from app.db.base_class import Base

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    cover_image_url = Column(String, nullable=True)
    published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
