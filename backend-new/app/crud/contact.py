from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.contact import ContactMessage, CareerApplication
from app.schemas.contact import ContactForm, CareerApplicationCreate

class CRUDContact:
    async def create_contact_message(self, db: AsyncSession, form_in: ContactForm) -> ContactMessage:
        db_obj = ContactMessage(
            name=form_in.name,
            email=form_in.email,
            message=form_in.message
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def create_career_application(self, db: AsyncSession, app_in: CareerApplicationCreate) -> CareerApplication:
        db_obj = CareerApplication(
            name=app_in.name,
            phone=app_in.phone,
            email=app_in.email,
            resume_filename=app_in.resume_filename,
            resume_base64=app_in.resume_base64
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_all_career_applications(self, db: AsyncSession) -> List[CareerApplication]:
        result = await db.execute(select(CareerApplication).order_by(CareerApplication.created_at.desc()))
        return list(result.scalars().all())

crud_contact = CRUDContact()
