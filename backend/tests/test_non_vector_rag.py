import os
import unittest
import sys
from pathlib import Path

os.environ.setdefault("SECRET_KEY", "unit-test-secret-key-unit-test-secret-key-01")
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:admin123@localhost:5432/pashuvaani",
)
os.environ.setdefault("OPENAI_API_KEY", "sk-test-not-used-in-offline-tests")
os.environ.setdefault("ADMIN_EMAIL", "admin@test.local")
os.environ.setdefault("ADMIN_PASSWORD", "test-admin-password-123")

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.reference_fallback import expand_query_tokens as _expand_query_tokens
from app.services.reference_fallback import retrieve_fallback_context


class ReferenceFallbackRagTests(unittest.TestCase):
    def test_query_expansion_hinglish_alias(self) -> None:
        expanded = _expand_query_tokens({"bukhar", "gaay"})
        self.assertIn("fever", expanded)
        self.assertIn("cow", expanded)

    def test_retrieval_returns_florfenicol_for_direct_query(self) -> None:
        context = retrieve_fallback_context("florfenicol dose for cattle fever")
        self.assertIn("florfenicol", context.lower())

    def test_retrieval_handles_hinglish_animal_query(self) -> None:
        context = retrieve_fallback_context("gaay ko bukhar me kaunsi dawai")
        self.assertNotIn("No relevant chunks found.", context)

    def test_retrieval_suggests_similar_name_for_typo(self) -> None:
        context = retrieve_fallback_context("amoxirin dose")
        self.assertIn("drug:", context.lower())
        self.assertIn("amoxicillin", context.lower())

    def test_retrieval_typo_with_cow_species_still_finds_amoxicillin(self) -> None:
        context = retrieve_fallback_context("cow amoxirin dose")
        self.assertNotIn("No relevant chunks found.", context)
        self.assertIn("amoxicillin", context.lower())


if __name__ == "__main__":
    unittest.main()
