from pydantic import BaseModel, EmailStr, Field


class DoctorApplicationCreate(BaseModel):
    """Public doctor registration form (stored as a pending Doctor row)."""

    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=5)
    email: EmailStr
    qualification: str = Field(..., min_length=1)
    registration_number: str = Field(..., min_length=1)
    specialization: str = Field(..., min_length=1)
    district: str = Field(..., min_length=1)
    experience_years: int = Field(..., ge=0, le=80)
    consultation_fee: float = Field(..., ge=0)
    availability: str = Field(..., min_length=1)


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
