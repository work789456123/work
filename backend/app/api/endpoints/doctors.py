from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud.doctor import crud_doctor
from app.db.session import get_db
from app.schemas.doctor import DoctorApplicationCreate, DoctorCreate, DoctorResponse

router = APIRouter()

# Stored in `specialty` until there is a dedicated applications table.
_APPLICATION_PREFIX = "[Application] "

_PLACEHOLDER_IMAGE = (
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200"
)


@router.get("", response_model=List[DoctorResponse])
async def get_doctors(db: AsyncSession = Depends(get_db)):
    doctors = await crud_doctor.get_multi(db)
    return [d for d in doctors if not (d.specialty or "").startswith(_APPLICATION_PREFIX)]


@router.post("/apply", response_model=DoctorResponse)
async def apply_as_doctor(
    body: DoctorApplicationCreate,
    db: AsyncSession = Depends(get_db),
):
    """Persist a public registration; team reviews before listing on /doctors."""
    fee_str = f"₹{body.consultation_fee:.0f}" if body.consultation_fee == int(body.consultation_fee) else f"₹{body.consultation_fee:.2f}"
    languages = (
        f"Email: {body.email}; Phone: {body.phone}; District: {body.district.strip()}"
    )
    experience = (
        f"{body.experience_years} yrs · {body.qualification.strip()} · "
        f"Reg: {body.registration_number.strip()}"
    )
    obj_in = DoctorCreate(
        name=body.name.strip(),
        specialty=f"{_APPLICATION_PREFIX}{body.specialization.strip()}",
        experience=experience,
        rating=0.0,
        reviews=0,
        image=_PLACEHOLDER_IMAGE,
        availability=body.availability.strip(),
        consultation_fee=fee_str,
        languages=languages,
    )
    return await crud_doctor.create(db, obj_in=obj_in)
