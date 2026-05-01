import os
import unittest
import sys
from pathlib import Path
from types import SimpleNamespace

os.environ.setdefault("SECRET_KEY", "unit-test-secret-key-unit-test-secret-key-01")
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:admin123@localhost:5432/pashuvaani",
)
os.environ.setdefault("OPENAI_API_KEY", "sk-test-not-used-in-offline-tests")
os.environ.setdefault("ADMIN_EMAIL", "admin@test.local")
os.environ.setdefault("ADMIN_PASSWORD", "test-admin-password-123")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.intake_gate import (
    assistant_message_count,
    evaluate_intake,
    initial_welcome_message,
)


class IntakeGateTests(unittest.TestCase):
    def test_emergency_bypasses_intake(self) -> None:
        ev = evaluate_intake("my cow collapsed and cannot stand", None)
        self.assertTrue(ev.emergency)
        self.assertTrue(ev.intake_complete)

    def test_incomplete_without_animal(self) -> None:
        ev = evaluate_intake("she has had fever for two days", None)
        self.assertFalse(ev.emergency)
        self.assertFalse(ev.intake_complete)

    def test_complete_with_animal_symptom_duration(self) -> None:
        ev = evaluate_intake("my cow has fever since 3 days", None)
        self.assertFalse(ev.emergency)
        self.assertTrue(ev.intake_complete)

    def test_dose_query_counts_as_shortcut(self) -> None:
        ev = evaluate_intake("florfenicol dose for cattle fever", None)
        self.assertTrue(ev.intake_complete)

    def test_history_accumulates_context(self) -> None:
        hist = [
            SimpleNamespace(role="user", content="meri gaay hai"),
            SimpleNamespace(role="assistant", content="ok"),
        ]
        ev = evaluate_intake("bukhar 2 din se hai", hist)
        self.assertTrue(ev.intake_complete)

    def test_romanized_drug_info_query_bypasses_intake(self) -> None:
        ev = evaluate_intake("mujhe Amoxcilyn ke bare mai jan na hai", None)
        self.assertFalse(ev.emergency)
        self.assertTrue(ev.intake_complete)

    def test_short_drug_name_only_bypasses_intake(self) -> None:
        ev = evaluate_intake("Amoxcilyn", None)
        self.assertFalse(ev.emergency)
        self.assertTrue(ev.intake_complete)

    def test_assistant_message_count(self) -> None:
        hist = [
            SimpleNamespace(role="user", content="hi"),
            SimpleNamespace(role="assistant", content="hello"),
            SimpleNamespace(role="user", content="cow fever"),
        ]
        self.assertEqual(assistant_message_count(hist), 1)
        self.assertEqual(assistant_message_count(None), 0)

    def test_initial_welcome_mentions_help_paths(self) -> None:
        text = initial_welcome_message("English")
        self.assertIn("1)", text)
        self.assertIn("4)", text)


if __name__ == "__main__":
    unittest.main()
