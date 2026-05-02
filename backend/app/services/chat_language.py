"""Map API/UI language labels to prompt keys (Hindi vs English)."""


def normalize_ui_language(language: str | None) -> str:
    """Map UI / API language strings to Hindi or English for system prompts."""
    if not language:
        return "English"
    raw = language.strip()
    low = raw.lower()
    if "hindi" in low or "हिंदी" in raw:
        return "Hindi"
    return "English"
