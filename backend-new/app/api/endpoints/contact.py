from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.schemas.contact import ContactForm, ContactResponse
from app.crud.contact import crud_contact
from app.services.email_service import email_service_impl
from app.core.config import settings

router = APIRouter()

def send_contact_notification(form_data: ContactForm):
    email_content = f"""
    <h3>New Contact Message</h3>
    <p><strong>Name:</strong> {form_data.name}</p>
    <p><strong>Email:</strong> {form_data.email}</p>
    <p><strong>Message:</strong><br/>{form_data.message}</p>
    """
    email_service_impl.send_email(
        to_email=settings.ADMIN_EMAIL,
        subject=f"New Contact Message from {form_data.name}",
        html_content=email_content
    )

@router.post("/", response_model=ContactResponse)
async def submit_contact_form(
    form_in: ContactForm,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    db_form = await crud_contact.create_contact_message(db, form_in=form_in)
    background_tasks.add_task(send_contact_notification, form_in)
    return db_form
