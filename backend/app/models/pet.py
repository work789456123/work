import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Pet(Base):
    __tablename__ = "pets"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    pet_type = Column(String, nullable=False)
    age = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    weight = Column(String, nullable=True)
    
    owner = relationship("User", back_populates="pets")
