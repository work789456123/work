import unittest
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services.ai_chat_service import _expand_query_tokens, _retrieve_reference_context


class NonVectorRagTests(unittest.TestCase):
    def test_query_expansion_hinglish_alias(self) -> None:
        expanded = _expand_query_tokens({"bukhar", "gaay"})
        self.assertIn("fever", expanded)
        self.assertIn("cow", expanded)

    def test_retrieval_returns_florfenicol_for_direct_query(self) -> None:
        context = _retrieve_reference_context("florfenicol dose for cattle fever")
        self.assertIn("florfenicol", context.lower())

    def test_retrieval_handles_hinglish_animal_query(self) -> None:
        context = _retrieve_reference_context("gaay ko bukhar me kaunsi dawai")
        self.assertNotIn("No relevant chunks found.", context)

    def test_retrieval_suggests_similar_name_for_typo(self) -> None:
        context = _retrieve_reference_context("amoxirin dose")
        self.assertIn("Possible medicine matches", context)
        self.assertIn("amoxicillin", context.lower())


if __name__ == "__main__":
    unittest.main()
