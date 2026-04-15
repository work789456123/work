import uuid
from sqlalchemy import Column, String, DateTime, func
from app.db.base_class import Base

class BannedDevice(Base):
    __tablename__ = "banned_devices"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    device_id = Column(String, unique=True, index=True, nullable=False)
    reason = Column(String, nullable=True)
    banned_at = Column(DateTime, server_default=func.now())
    ip_address = Column(String, nullable=True)
