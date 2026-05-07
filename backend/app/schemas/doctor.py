from pydantic import BaseModel

class DoctorCreate(BaseModel):
    name: str
    specialty: str
    experience: str
    rating: float = 0.0
    reviews: int = 0
    image: str = ""
    availability: str
    consultation_fee: str
    languages: str

class DoctorResponse(DoctorCreate):
    id: str
    
    class Config:
        from_attributes = True
