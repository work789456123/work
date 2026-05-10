import uuid
from sqlalchemy import Column, String, Float, Integer
from app.db.base_class import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    specialty = Column(String, nullable=False)
    experience = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    reviews = Column(Integer, nullable=False)
    image = Column(String, nullable=False)
    availability = Column(String, nullable=False)
    consultation_fee = Column(String, nullable=False)
    languages = Column(String, nullable=False)
