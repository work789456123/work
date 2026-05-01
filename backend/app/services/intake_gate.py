"""Decide whether minimum intake context exists before full veterinary advice or vet referral."""

from __future__ import annotations

import re
from dataclasses import dataclass

from app.services.reference_fallback import expand_query_tokens

# High-precision emergency cues — bypass intake when matched.
_EMERGENCY_EN = (
    "not breathing",
    "stopped breathing",
    "can't breathe",
    "cannot breathe",
    "choking",
    "unconscious",
    "collapse",
    "collapsed",
    "seizure",
    "convulsion",
    "severe bleed",
    "bleeding heavily",
    "poisoned",
    "bloat",
    "twisted stomach",
    "hit by car",
    "unable to stand",
    "won't stand",
    "non-responsive",
)

_EMERGENCY_HI = (
    "सांस बंद",
    "सांस नहीं",
    "दम घुट",
    "बेहोश",
    "खून बह रहा",
    "जहर खा",
    "जहर लग",
    "फूला हुआ पेट",
    "डकार नहीं",
    "गिर गया",
    "खड़ा नहीं हो",
)

_ANIMAL_EN = (
    "cow",
    "cattle",
    "buffalo",
    "goat",
    "sheep",
    "lamb",
    "dog",
    "cat",
    "pig",
    "poultry",
    "chicken",
    "hen",
    "calf",
    "bull",
    "mare",
    "horse",
    "donkey",
    "camel",
    "rabbit",
    "bird",
    "duck",
    "turkey",
    "fish",
    "gaay",
    "bakri",
    "bhains",
    "murrah",
)

_ANIMAL_HI = (
    "गाय",
    "भैंस",
    "बकरी",
    "भेड़",
    "कुत्ता",
    "बिल्ली",
    "सूअर",
    "मुर्गी",
    "बछड़ा",
    "बछिया",
    "घोड़ा",
    "ऊंट",
)

_SYMPTOM_OR_TOPIC_EN = (
    "fever",
    "cough",
    "diarrhoea",
    "diarrhea",
    "vomit",
    "wound",
    "lameness",
    "lame",
    "not eating",
    "off feed",
    "swollen",
    "mastitis",
    "milk fever",
    "retained",
    "dystocia",
    "abortion",
    "lumps",
    "breathing",
    "weight loss",
    "bloat",
    "poison",
)

_SYMPTOM_OR_TOPIC_HI = (
    "बुखार",
    "खांसी",
    "दस्त",
    "उल्टी",
    "घाव",
    "लंगड़",
    "खाना नहीं",
    "सूजन",
    "दूध",
    "प्रसव",
    "सांस",
)

_DURATION_EN = re.compile(
    r"\b(\d+)\s*(day|days|hour|hours|week|weeks|month|months)\b|"
    r"\bsince\b|"
    r"\byesterday\b|"
    r"\btoday\b|"
    r"\blast\s+\d+",
    re.I,
)
_DURATION_HI = re.compile(
    r"\d+\s*(दिन|घंटे|मिनट|हफ्ते|महीने|din)|"
    r"कल\s+से|आज\s+से|पिछले|कब\s+से",
    re.I,
)

_DOSE_OR_DRUG_HINT = re.compile(
    r"\b(dose|dosage|mg/kg|iu/kg|tablet|injection|florfenicol|amoxicillin|penicillin|"
    r"oxytetracycline|ivermectin|enrofloxacin|ceftiofur)\b",
    re.I,
)
_DOSE_OR_DRUG_HINT_HI = re.compile(
    r"(खुराक|इंजेक्शन|टैबलेट|एमजी|फ्लोरफेनिकॉल|अमोक्सिसिलिन|पेनिसिलिन)",
    re.I,
)

_EDUCATIONAL_EN = re.compile(
    r"\b(what is|how to prevent|symptoms of|signs of|vaccination schedule|deworm|nutrition)\b",
    re.I,
)
_EDUCATIONAL_HI = re.compile(r"(क्या है|लक्षण|बचाव|टीकाकरण|कीड़े|पोषण)", re.I)

_TOKEN_SPLIT = re.compile(r"[^\w\u0900-\u097F]+", re.UNICODE)

_CANONICAL_SYMPTOM_TOKENS = frozenset(
    {
        "fever",
        "cough",
        "diarrhoea",
        "diarrhea",
        "vomit",
        "wound",
        "lameness",
        "lame",
        "mastitis",
        "bleeding",
        "swollen",
        "seizure",
        "poison",
        "bloat",
        "breathing",
        "weight",
        "loss",
        "eating",
        "feed",
    }
)


def _tokenize_blob(blob: str) -> set[str]:
    return {x for x in _TOKEN_SPLIT.split(blob.lower()) if len(x) > 1}


@dataclass(frozen=True)
class IntakeEvaluation:
    intake_complete: bool
    emergency: bool


def _normalize_roles(history: list | None) -> str:
    if not history:
        return ""
    parts: list[str] = []
    for msg in history:
        role = getattr(msg, "role", None)
        content = getattr(msg, "content", None)
        if role == "user" and content:
            parts.append(str(content))
    return " ".join(parts)


def evaluate_intake(user_message: str, chat_history: list | None) -> IntakeEvaluation:
    """Heuristic intake: animal + problem + (duration OR dose/education shortcut)."""
    um = user_message or ""
    blob = (_normalize_roles(chat_history) + " " + um).lower()

    for phrase in _EMERGENCY_EN:
        if phrase in blob:
            return IntakeEvaluation(intake_complete=True, emergency=True)
    for phrase in _EMERGENCY_HI:
        if phrase in blob:
            return IntakeEvaluation(intake_complete=True, emergency=True)

    blob_tokens = expand_query_tokens(_tokenize_blob(blob))

    has_animal = any(a in blob for a in _ANIMAL_EN) or any(a in um for a in _ANIMAL_HI)
    has_topic = (
        bool(blob_tokens & _CANONICAL_SYMPTOM_TOKENS)
        or any(s in blob for s in _SYMPTOM_OR_TOPIC_EN)
        or any(s in um for s in _SYMPTOM_OR_TOPIC_HI)
        or bool(_DOSE_OR_DRUG_HINT.search(blob))
        or bool(_DOSE_OR_DRUG_HINT_HI.search(um))
        or bool(_EDUCATIONAL_EN.search(blob))
        or bool(_EDUCATIONAL_HI.search(um))
    )

    has_duration = bool(_DURATION_EN.search(blob)) or bool(_DURATION_HI.search(um))
    dose_or_edu = (
        bool(_DOSE_OR_DRUG_HINT.search(blob))
        or bool(_EDUCATIONAL_EN.search(blob))
        or bool(_EDUCATIONAL_HI.search(um))
    )

    if has_animal and has_topic and (has_duration or dose_or_edu):
        return IntakeEvaluation(intake_complete=True, emergency=False)

    if has_animal and has_topic:
        # Symptom present but no duration and not a dose/education shortcut — still incomplete.
        return IntakeEvaluation(intake_complete=False, emergency=False)

    return IntakeEvaluation(intake_complete=False, emergency=False)


def intake_ask_back_message(language: str, evaluation: IntakeEvaluation) -> str:
    """Short clarifying reply when intake is incomplete (not an emergency)."""
    if evaluation.emergency:
        return ""

    if language == "Hindi":
        return (
            "कृपया थोड़ा और बताएं: कौन सा जानवर है, मुख्य समस्या क्या है, "
            "और लक्षण कब से हैं? इन जानकारियों के बाद ही मैं सुरक्षित सलाह दे पाऊँगा।"
        )

    return (
        "Please share a bit more: which animal, the main problem, and how long you have seen "
        "these signs. I need that context before giving careful guidance."
    )
