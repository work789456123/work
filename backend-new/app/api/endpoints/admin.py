from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.db.session import get_db
from app.api.dependencies import get_current_admin
from app.models.user import User
from app.models.pet import Pet
from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.admin_data import DoctorApplication, EmergencyLog
from app.schemas.appointment import AppointmentResponse
from app.schemas.blog import BlogCreate, BlogResponse
from app.schemas.admin_data import DoctorApplicationResponse, EmergencyLogResponse
from app.schemas.user import AdminLogin
from app.api.endpoints.auth import create_access_token, pwd_context
from app.crud.user import crud_user
from app.crud.appointment import crud_appointment
from app.crud.blog import crud_blog

router = APIRouter()

@router.post("/login")
async def admin_login(admin_in: AdminLogin, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=admin_in.email)
    if not user or user.role != "admin" or not pwd_context.verify(admin_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid admin credentials")
        
    token_data = {"sub": user.id, "email": user.phone_or_email, "role": user.role}
    token = create_access_token(token_data)
    
    return {"token": token, "admin": {"id": user.id, "email": user.phone_or_email, "role": user.role}}

@router.get("/dashboard")
async def get_admin_dashboard(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    # Basic Stats
    total_users = await db.scalar(select(func.count(User.id)).where(User.role == "user"))
    total_pets = await db.scalar(select(func.count(Pet.id)))
    total_doctors = await db.scalar(select(func.count(Doctor.id)))
    total_appointments = await db.scalar(select(func.count(Appointment.id)))
    
    # Recent & Pending
    pending_doctor_applications = await db.scalar(select(func.count(DoctorApplication.id)).where(DoctorApplication.status == "pending"))
    
    # Emergency Alerts (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    emergency_alerts_7d = await db.scalar(select(func.count(EmergencyLog.id)).where(EmergencyLog.timestamp >= seven_days_ago))
    
    # Credit Analytics (Simplified for parity)
    # In a real system we would track purchases in a separate table
    # For now, we'll return 0 or placeholder based on current schema
    stats = {
        "total_users": total_users,
        "total_pets": total_pets,
        "total_doctors": total_doctors,
        "total_appointments": total_appointments,
        "pending_doctor_applications": pending_doctor_applications,
        "emergency_alerts_7d": emergency_alerts_7d,
        "total_credits_purchased": 0,
        "total_credits_used": await db.scalar(select(func.sum(User.daily_message_count))) or 0,
        "revenue_from_credits": 0
    }
    
    return stats

@router.get("/appointments", response_model=List[AppointmentResponse])
async def get_all_appointments(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return await crud_appointment.get_all(db)

@router.put("/appointments/{appointment_id}/confirm", response_model=AppointmentResponse)
async def confirm_appointment(
    appointment_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    appointment = await crud_appointment.update_status(db, appointment_id, "confirmed")
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.put("/appointments/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel_appointment(
    appointment_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    appointment = await crud_appointment.update_status(db, appointment_id, "cancelled")
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.get("/doctor-applications", response_model=List[DoctorApplicationResponse])
async def get_doctor_applications(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    query = select(DoctorApplication)
    if status:
        query = query.where(DoctorApplication.status == status)
    result = await db.execute(query.order_by(DoctorApplication.created_at.desc()))
    return result.scalars().all()

@router.put("/doctor-applications/{app_id}/approve", response_model=DoctorApplicationResponse)
async def approve_doctor_application(
    app_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(DoctorApplication).where(DoctorApplication.id == app_id))
    app = result.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = "approved"
    await db.commit()
    await db.refresh(app)
    return app

@router.put("/doctor-applications/{app_id}/reject", response_model=DoctorApplicationResponse)
async def reject_doctor_application(
    app_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(DoctorApplication).where(DoctorApplication.id == app_id))
    app = result.scalars().first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = "rejected"
    await db.commit()
    await db.refresh(app)
    return app

@router.get("/emergency-logs", response_model=List[EmergencyLogResponse])
async def get_emergency_logs(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    result = await db.execute(select(EmergencyLog).order_by(EmergencyLog.timestamp.desc()).limit(100))
    return result.scalars().all()

@router.get("/blogs", response_model=List[BlogResponse])
async def get_all_blogs(
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return await crud_blog.get_multi(db, published_only=False)

@router.post("/blogs", response_model=BlogResponse)
async def create_blog(
    blog_in: BlogCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return await crud_blog.create(db, blog_in=blog_in)
