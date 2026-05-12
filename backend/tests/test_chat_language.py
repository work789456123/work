import os
import sys
import unittest
from pathlib import Path

os.environ.setdefault("SECRET_KEY", "unit-test-secret-key-unit-test-secret-key-01")
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:admin123@localhost:5432/pashuvaani",
)
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.chat_language import normalize_ui_language


class ChatLanguageTests(unittest.TestCase):
    def test_normalize_ui_language(self) -> None:
        self.assertEqual(normalize_ui_language("हिंदी (Hindi)"), "Hindi")
        self.assertEqual(normalize_ui_language("English"), "English")
        self.assertEqual(normalize_ui_language(None), "English")


if __name__ == "__main__":
    unittest.main()
