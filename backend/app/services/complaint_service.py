import datetime
import random
import string
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.complaint_model import Complaint, ComplaintLog, ComplaintStatus
from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.pet import Pet
from app.schemas.complaint import ComplaintCreate

class ComplaintService:
    async def generate_tracking_id(self, db: AsyncSession) -> str:
        year = datetime.datetime.utcnow().year
        # Simple random generation for ##### part, can be improved to be sequential if needed
        suffix = ''.join(random.choices(string.digits, k=5))
        tracking_id = f"PSV-{year}-{suffix}"
        
        # Check if exists (unlikely with 5 digits but good practice)
        result = await db.execute(select(Complaint).where(Complaint.id == tracking_id))
        if result.scalar_one_or_none():
            return await self.generate_tracking_id(db)
        return tracking_id

    async def create_complaint(self, db: AsyncSession, user_id: str, obj_in: ComplaintCreate) -> Complaint:
        tracking_id = await self.generate_tracking_id(db)
        
        db_complaint = Complaint(
            id=tracking_id,
            user_id=user_id,
            pet_id=obj_in.pet_id,
            title=obj_in.title,
            description=obj_in.description,
            symptoms=obj_in.symptoms,
            priority=obj_in.priority,
            status=ComplaintStatus.OPEN
        )
        db.add(db_complaint)
        await db.flush() # Flush to get it ready for appointment association
        
        if obj_in.book_appointment:
            # Try to find a doctor
            doctor_result = await db.execute(select(Doctor).where(Doctor.availability_status == "available").limit(1))
            doctor = doctor_result.scalar_one_or_none()
            
            # Get pet info if pet_id is provided
            pet_name, pet_type, gender = "Unknown", "Unknown", "Unknown"
            if obj_in.pet_id:
                pet_result = await db.execute(select(Pet).where(Pet.id == obj_in.pet_id))
                pet = pet_result.scalar_one_or_none()
                if pet:
                    pet_name = pet.name
                    pet_type = pet.species
                    gender = pet.gender

            # Create appointment
            db_appointment = Appointment(
                user_id=user_id,
                complaint_id=tracking_id,
                doctor_id=doctor.id if doctor else None,
                pet_name=pet_name,
                pet_type=pet_type,
                gender=gender,
                time_slot=obj_in.appointment_time_slot or "To be assigned",
                status="SCHEDULED",
                owner_name="User", # Should ideally come from user model
                owner_number="0000000000" # Should ideally come from user model
            )
            db.add(db_appointment)
            
            if doctor:
                db_complaint.status = ComplaintStatus.ASSIGNED
        
        # Log creation
        log = ComplaintLog(
            complaint_id=tracking_id,
            status=db_complaint.status,
            updated_by=user_id,
            notes="Initial complaint creation"
        )
        db.add(log)
        
        await db.commit()
        await db.refresh(db_complaint)
        return db_complaint

    async def get_user_complaints(self, db: AsyncSession, user_id: str):
        result = await db.execute(select(Complaint).where(Complaint.user_id == user_id, Complaint.is_deleted == False))
        return result.scalars().all()

complaint_service = ComplaintService()
