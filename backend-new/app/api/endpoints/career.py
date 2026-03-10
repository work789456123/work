from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.contact import CareerApplicationCreate, CareerApplicationResponse
from app.crud.contact import crud_contact

router = APIRouter()

@router.post("/", response_model=CareerApplicationResponse)
async def submit_career_application(
    application_in: CareerApplicationCreate,
    db: AsyncSession = Depends(get_db)
):
    # In a prod environment, we would upload the resume base64 to S3 here.
    return await crud_contact.create_career_application(db, app_in=application_in)
