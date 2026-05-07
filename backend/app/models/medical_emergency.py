import uuid
import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from app.db.base_class import Base

class MedicalEmergency(Base):
    __tablename__ = "medical_emergencies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    mobile_number = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="pending") # pending, resolved
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
