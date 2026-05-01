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

# Romanized Hindi / English “tell me about this drug” without full clinical intake.
_INFO_INTENT = re.compile(
    r"bare\s*me|bare\s*mai|ke\s*bare\s*me|ke\s*bare\s*mai|jan\s*na|janna|जानना|जानकारी|"
    r"want\s+to\s+know|tell\s+me|what\s+is|information|learn\s+about",
    re.I,
)
_DRUG_STEM = re.compile(
    r"\b(amox|penicillin|florfen|ivermect|enroflox|oxytetra|ceftiofur|tylosin|"
    r"dexame|melox|ketopro|sulfa|trimeth|metronidaz|fenbendaz|albendaz|ivermec)\w*",
    re.I,
)

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


def assistant_message_count(chat_history: list | None) -> int:
    """How many assistant replies are already in this thread (excludes the reply we are about to send)."""
    if not chat_history:
        return 0
    return sum(1 for m in chat_history if getattr(m, "role", None) == "assistant")


def _general_medication_info_query(blob: str, user_message: str) -> bool:
    """Allow reference-backed answers about a named drug without animal + duration first."""
    if not _DRUG_STEM.search(blob):
        return False
    if _INFO_INTENT.search(blob):
        return True
    um = (user_message or "").strip()
    if len(um) >= 3 and len(um.split()) <= 3:
        return True
    return False


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

    if _general_medication_info_query(blob, um):
        return IntakeEvaluation(intake_complete=True, emergency=False)

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


def initial_welcome_message(language: str) -> str:
    """First incomplete-intake reply: explain how we can help instead of a single rigid paragraph."""
    if language == "Hindi":
        return (
            "नमस्ते! मैं आपकी पशु/पालतू स्वास्थ्य में मदद के लिए यहाँ हूँ। "
            "बताइए, आज किस तरह मदद चाहिए?\n\n"
            "1) जानवर के साथ कोई सामान्य सवाल या समस्या\n"
            "2) अपने जानवर के बारे में जानना (खान-पान, टीकाकरण, देखभाल)\n"
            "3) बीमारी या इलाज की बात (लक्षण, दवा की जानकारी — खुराक हमेशा वेट से पूछें)\n"
            "4) फर्स्ट एड / तुरंत ध्यान देने वाली स्थिति (गंभीर लक्षण पर तुरंत वेट से संपर्क करें)\n\n"
            "आप नंबर लिख सकते हैं या अपने शब्दों में लिख सकते हैं। "
            "किसी दवा के बारे में सिर्फ जानकारी चाहिए तो भी पूछ सकते हैं।"
        )
    return (
        "Hi — I am here to help with your animal’s health. What would you like today?\n\n"
        "1) General question or concern about an animal\n"
        "2) Learn about your animal (feeding, vaccines, routine care)\n"
        "3) Illness or treatment discussion (symptoms, drug information — dosing must come from a vet)\n"
        "4) First aid / urgent warning signs (true emergencies: contact a vet immediately)\n\n"
        "You can reply with a number or just describe things in your own words. "
        "If you only want information about a medicine (for example what amoxicillin is), ask that too."
    )


def follow_up_incomplete_message(language: str) -> str:
    """Later turns when clinical intake is still missing — shorter, not identical to the welcome."""
    if language == "Hindi":
        return (
            "सुरक्षित सलाह के लिए थोड़ा और चाहिए: कौन सा जानवर है, मुख्य समस्या क्या है, "
            "और लक्षण लगभग कब से हैं? जितना बता पाएँ, उतना अच्छा।"
        )
    return (
        "To keep this safe I still need a bit more: which animal, the main problem, "
        "and roughly how long you have noticed it. Whatever detail you can share helps."
    )


def intake_ask_back_message(language: str, evaluation: IntakeEvaluation) -> str:
    """Short clarifying reply when intake is incomplete (not an emergency)."""
    if evaluation.emergency:
        return ""
    return follow_up_incomplete_message(language)
