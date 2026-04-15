import uuid
from sqlalchemy import Column, String, Integer, DateTime, func
from app.db.base_class import Base

class DeviceUsage(Base):
    __tablename__ = "device_usages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_hash = Column(String, unique=True, index=True, nullable=False)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)
    daily_message_count = Column(Integer, default=0)
    last_message_at = Column(DateTime, server_default=func.now())
