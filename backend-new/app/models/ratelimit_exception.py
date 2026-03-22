import uuid
from sqlalchemy import Column, String, DateTime
from app.db.base_class import Base
from datetime import datetime

class RatelimitException(Base):
    __tablename__ = "ratelimit_exceptions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    reason = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
