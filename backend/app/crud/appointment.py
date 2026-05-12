from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.models.appointment import Appointment
from app.models.user import User
from app.schemas.appointment import AppointmentCreate, AppointmentResponse

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
            time_slot=appointment_in.time_slot,
            source=appointment_in.source,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    def _to_response(self, appt: Appointment) -> AppointmentResponse:
        """Convert ORM object to response schema, injecting user_email if loaded."""
        data = AppointmentResponse.model_validate(appt)
        if appt.user:
            data.user_email = appt.user.phone_or_email
        return data

    async def get_multi_by_user(self, db: AsyncSession, user_id: str) -> List[Appointment]:
        result = await db.execute(
            select(Appointment)
            .where(Appointment.user_id == user_id)
            .order_by(Appointment.id.desc())
        )
        return list(result.scalars().all())
        
    async def get_all(self, db: AsyncSession) -> List[AppointmentResponse]:
        result = await db.execute(
            select(Appointment)
            .options(joinedload(Appointment.user))
            .order_by(Appointment.id.desc())
        )
        appointments = result.scalars().all()
        return [self._to_response(a) for a in appointments]
        
    async def update_status(self, db: AsyncSession, appointment_id: str, status: str) -> Appointment | None:
        result = await db.execute(select(Appointment).where(Appointment.id == appointment_id))
        db_obj = result.scalars().first()
        if db_obj:
            db_obj.status = status
            await db.commit()
            await db.refresh(db_obj)
        return db_obj

crud_appointment = CRUDAppointment()
