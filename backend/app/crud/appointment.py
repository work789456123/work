from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.appointment import Appointment
from app.schemas.appointment import AppointmentCreate

class CRUDAppointment:
    async def create(self, db: AsyncSession, appointment_in: AppointmentCreate, user_id: str) -> Appointment:
        db_obj = Appointment(
            user_id=user_id,
            pet_name=appointment_in.pet_name,
            pet_type=appointment_in.pet_type,
            gender=appointment_in.gender,
            age=appointment_in.age,
            weight=appointment_in.weight,
            weight_unit=appointment_in.weight_unit,
            owner_name=appointment_in.owner_name,
            owner_number=appointment_in.owner_number,
            vaccination_status=appointment_in.vaccination_status,
            medical_history_available=appointment_in.medical_history_available,
            medical_history=appointment_in.medical_history,
            time_slot=appointment_in.time_slot
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get_multi_by_user(self, db: AsyncSession, user_id: str) -> List[Appointment]:
        result = await db.execute(select(Appointment).where(Appointment.user_id == user_id))
        return list(result.scalars().all())
        
    async def get_all(self, db: AsyncSession) -> List[Appointment]:
        result = await db.execute(select(Appointment))
        return list(result.scalars().all())
        
    async def update_status(self, db: AsyncSession, appointment_id: str, status: str) -> Appointment | None:
        result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
        db_obj = result.scalars().first()
        if db_obj:
            db_obj.status = status
            await db.commit()
            await db.refresh(db_obj)
        return db_obj

crud_appointment = CRUDAppointment()
