from fastapi import APIRouter

from app.api.endpoints import (
    auth,
    pets,
    appointments,
    chat,
    speech,
    blogs,
    contact,
    career,
    doctors,
    admin,
    credits,
    complaints,
    marketplace,
    slack,
    medical_emergency,
    whatsapp,
    telegram,
    pet_cabs,
)
from app.api import product

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(credits.router, prefix="/credits", tags=["credits"])
api_router.include_router(pets.router, prefix="/pets", tags=["pets"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["complaints"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["marketplace"])

api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(speech.router, prefix="/speech", tags=["speech"])
api_router.include_router(blogs.router, prefix="/blogs", tags=["blogs"])
api_router.include_router(contact.router, prefix="/contact", tags=["contact"])
api_router.include_router(career.router, prefix="/career", tags=["career"])
api_router.include_router(doctors.router, prefix="/doctors", tags=["doctors"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(product.router, prefix="/products", tags=["products"])
api_router.include_router(slack.router, prefix="/slack", tags=["slack"])
api_router.include_router(medical_emergency.router, prefix="/medical-emergency", tags=["medical_emergency"])
api_router.include_router(whatsapp.router, prefix="/whatsapp", tags=["whatsapp"])
api_router.include_router(telegram.router, prefix="/telegram", tags=["telegram"])
api_router.include_router(pet_cabs.router, prefix="/pet-cabs", tags=["pet_cabs"])
