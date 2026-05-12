import unittest
from unittest.mock import AsyncMock, MagicMock
from app.services.complaint_service import complaint_service
from app.schemas.complaint import ComplaintCreate
from app.models.complaint_model import ComplaintStatus, ComplaintPriority

class TestComplaintService(unittest.IsolatedAsyncioTestCase):
    async def test_generate_tracking_id(self):
        db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        db.execute.return_value = mock_result
        
        tracking_id = await complaint_service.generate_tracking_id(db)
        self.assertTrue(tracking_id.startswith("PSV-"))
        self.assertEqual(len(tracking_id.split("-")), 3)

    async def test_create_complaint_basic(self):
        db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        db.execute.return_value = mock_result
        
        obj_in = ComplaintCreate(
            title="Sick cow",
            description="Cow has fever",
            symptoms="High temperature",
            priority=ComplaintPriority.HIGH,
            book_appointment=False
        )
        
        complaint = await complaint_service.create_complaint(db, user_id="user-123", obj_in=obj_in)
        
        self.assertEqual(complaint.title, "Sick cow")
        self.assertEqual(complaint.user_id, "user-123")
        self.assertEqual(complaint.status, ComplaintStatus.OPEN)
        db.add.assert_called()

    async def test_create_complaint_with_appointment(self):
        db = AsyncMock()

        mock_result_id = MagicMock()
        mock_result_id.scalar_one_or_none.return_value = None

        mock_pet_owner = MagicMock()
        mock_pet_owner.scalar_one_or_none.return_value = MagicMock(
            user_id="user-123", name="Bessie", pet_type="Cow", gender="Female"
        )

        mock_result_doc = MagicMock()
        mock_result_doc.scalar_one_or_none.return_value = MagicMock(id="doc-123", availability="available")

        mock_pet_appt = MagicMock()
        mock_pet_appt.scalar_one_or_none.return_value = MagicMock(
            name="Bessie", pet_type="Cow", gender="Female"
        )

        db.execute.side_effect = [
            mock_result_id,  # tracking id collision check
            mock_pet_owner,  # pet ownership validation
            mock_result_doc,  # doctor
            mock_pet_appt,  # pet details for appointment
        ]

        obj_in = ComplaintCreate(
            title="Sick cow",
            description="Cow has fever",
            pet_id="pet-123",
            book_appointment=True,
            appointment_time_slot="Morning",
        )

        complaint = await complaint_service.create_complaint(db, user_id="user-123", obj_in=obj_in)

        self.assertEqual(complaint.status, ComplaintStatus.ASSIGNED)
        self.assertEqual(db.add.call_count, 3)

if __name__ == "__main__":
    unittest.main()
