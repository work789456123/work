from pydantic import BaseModel

class DoctorResponse(BaseModel):
    id: str
    name: str
    specialty: str
    experience: str
    rating: float
    reviews: int
    image: str
    availability: str
    consultation_fee: str
    languages: str
    
    class Config:
        from_attributes = True
