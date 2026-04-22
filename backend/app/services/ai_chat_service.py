import json
import logging
import os
import re

from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Veterinary reference data — loaded once at startup
# ---------------------------------------------------------------------------
_REF_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data", "vet_reference")


def _fmt_cattle_ref(data: dict) -> str:
    lines = [f"# {data.get('animal', 'Animal').upper()} MEDICATIONS", f"Source: {data.get('source', '')}"]
    for med in data.get("medications", []):
        lines.append(f"\nDrug: {med['drug']}")
        lines.append(f"  Conditions: {', '.join(med.get('condition', []))}")
        lines.append(f"  Dose: {med.get('min_dose')} – {med.get('max_dose')}")
        lines.append(f"  Route: {med.get('route')}")
        lines.append(f"  Frequency: {med.get('frequency')}")
        if med.get("notes"):
            lines.append(f"  Notes: {med['notes']}")
    return "\n".join(lines)


def _fmt_svtg_ref(data: dict) -> str:
    lines = [f"# {data.get('animal', 'Animal').upper()} MEDICATIONS", f"Source: {data.get('source', '')}"]
    for med in data.get("medications", []):
        lines.append(f"\nDrug: {med['drug']}")
        lines.append(f"  Conditions: {', '.join(med.get('condition', []))}")
        lines.append(f"  Dose: {med.get('min_dose')} – {med.get('max_dose')}")
        lines.append(f"  Route: {med.get('route')}")
        lines.append(f"  Frequency: {med.get('frequency')}")
        if med.get("notes") and med.get("frequency"):
            lines.append(f"  Notes: {med['notes']}")
        lines.append("")
    return "\n".join(lines)


def _load_all_references() -> str:
    parts = []
    files = {
        "cattle_medications.json": _fmt_cattle_ref,
        "svtg_medications.json": _fmt_svtg_ref,
    }
    for filename, formatter in files.items():
        path = os.path.join(_REF_DIR, filename)
        try:
            with open(path, "r") as f:
                data = json.load(f)
            parts.append(formatter(data))
        except Exception as e:
            logger.warning(f"Could not load {filename}: {e}")
    return "\n\n".join(parts)


_MEDICATION_REFERENCE = _load_all_references()

# ---------------------------------------------------------------------------
# Severity tag parsing
# ---------------------------------------------------------------------------

def _parse_severity(text: str) -> tuple[str, str]:
    """
    Extract the SEVERITY tag Gopu appends to every response.
    Returns (clean_response, severity_level).
    Falls back to 'low' if tag is missing or unrecognised.
    """
    match = re.search(r"\[SEVERITY:\s*(low|moderate|critical)\]", text, re.IGNORECASE)
    if match:
        level = match.group(1).lower()
        clean = text[:match.start()].rstrip() + text[match.end():]
        return clean.strip(), level
    return text.strip(), "low"


# ---------------------------------------------------------------------------
# AI Chat Service
# ---------------------------------------------------------------------------

class AIChatService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

        # Medication reference suffix appended to every language prompt
        _med_suffix = f"""
MEDICATION GUIDANCE — STRICT RULES:
- You MAY name a medication and explain what it is used for.
- You MUST mention the general safe range (min and max dose) ONLY from the VETERINARY REFERENCE DATA below.
- CRITICAL: If the drug or animal combination is NOT found in the VETERINARY REFERENCE DATA, say:
  "Is dawai ya bimari ke baare mein mujhe abhi poori jaankari nahi hai. Kripya ek veterinary doctor se milein."
  Do NOT guess or invent dosages.
- Always add this disclaimer after any medication mention:
  "Sahi dose aur tarika sirf ek certified veterinary doctor hi bata sakta hai."

SEVERITY TAGGING — MANDATORY:
At the very end of EVERY response, append exactly one tag on its own line:
  [SEVERITY: low]      — general query, minor issue, routine care
  [SEVERITY: moderate] — concerning symptoms, needs vet attention soon
  [SEVERITY: critical] — emergency, life-threatening, needs immediate vet
If unsure, default to [SEVERITY: moderate].

VETERINARY REFERENCE DATA (use ONLY this for medication guidance):
---
{_MEDICATION_REFERENCE}
---
"""

        self.prompts = {
            "Hindi": f"""
आप पाशुवाणी (PashuVaani) के लिए एक मिलनसार और सरल एआई पशु चिकित्सा सहायक, गोपु (Gopu) हैं।
आपका लक्ष्य भारतीय पालतू और पशुपालकों की आसान और सही सलाह से मदद करना है।

भाषा का नियम (STRICT LANGUAGE RULE):
- आपको हमेशा सिर्फ और सिर्फ सरल हिंदी (देवनागरी लिपि) में जवाब देना है।
- **हिंग्लिश (Hinglish) या अंग्रेजी अक्षरों का इस्तेमाल बिल्कुल न करें।**
- यहाँ तक कि 'Doctor', 'Medicine', 'Fever' जैसे शब्दों को भी हिंदी में लिखें (डॉक्टर, दवाई, बुखार)।
- कोष्ठक (brackets) में भी अंग्रेजी शब्द न लिखें।

मुख्य नियम (CORE PRINCIPLES):
1. 'पशु भी परिवार है' भावना का पालन करें। बहुत ही आत्मीय और सरल भाषा का उपयोग करें।
2. जटिल चिकित्सा शब्दों से बचें। सीधी और आसान भाषा का उपयोग करें।
3. पूरी सहानुभूति रखें - हर जानवर को प्रिय परिवार के सदस्य की तरह मानें।
4. **सत्यता (GROUNDEDNESS)**: यदि आप किसी जानकारी के बारे में सुनिश्चित नहीं हैं, तो अनुमान न लगाएं। साफ कहें कि आपको इसके बारे में जानकारी नहीं है और डॉक्टर से सलाह लेने को कहें।

सुरक्षा (SAFETY):
- यदि जानवर की स्थिति बहुत खराब है, तो तुरंत डॉक्टर को दिखाने की सलाह दें।

जवाब की लंबाई (RESPONSE LENGTH):
- जवाब छोटा और सीधा रखें — अधिकतम 3 से 4 वाक्य।
- लंबी व्याख्या से बचें। सिर्फ जरूरी जानकारी दें।
{_med_suffix}""",

            "English": f"""
You are Gopu (गोपु), the friendly and simple AI veterinary assistant for PashuVaani.
Your goal is to help Indian pet and livestock owners with easy-to-follow advice.

STRICT LANGUAGE RULE:
- You MUST strictly respond ONLY in simple English.
- **Do not use Hindi, Hinglish, or any other languages.**
- Do not use Hindi words in parenthesis. Keep the entire response in English.

CORE PRINCIPLES:
1. 'Pashu bhi Pariwar hai' (Pet is Family). Use very warm and simple language.
2. Keep your explanations very simple. Avoid complex medical jargon.
3. Total empathy - treat every animal like a beloved family member.
4. **GROUNDEDNESS**: Do not hallucinate or guess. If you are unsure or the information is not in the provided reference data, admit ignorance and recommend a vet.

SAFETY:
- If the animal's condition looks very bad, advise seeing a doctor immediately.

RESPONSE LENGTH:
- Keep responses short and to the point — maximum 3 to 4 sentences.
- Avoid lengthy explanations. Give only the most important advice clearly.
{_med_suffix}"""
        }

    async def get_response(self, user_message: str, image_base64: str = None, chat_history: list = None, language: str = "Hindi") -> dict:
        """Get an AI response maintaining context from history."""
        try:
            selected_prompt = self.prompts.get(language, self.prompts["English"])
            messages = [{"role": "system", "content": selected_prompt}]

            if chat_history:
                for msg in chat_history:
                    messages.append({"role": msg.role, "content": msg.content})

            content_payload = [{"type": "text", "text": user_message}]

            if image_base64:
                prefix = ""
                if not image_base64.startswith("data:image"):
                    prefix = "data:image/jpeg;base64,"
                content_payload.append({
                    "type": "image_url",
                    "image_url": {"url": f"{prefix}{image_base64}"}
                })

            messages.append({"role": "user", "content": content_payload})

            response = await self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=400,
                temperature=0.2
            )

            raw_response = response.choices[0].message.content
            clean_response, severity = _parse_severity(raw_response)
            return {
                "response": clean_response,
                "severity": severity
            }
        except Exception as e:
            logger.error(f"AI Chat Error: {e}")
            raise Exception("Our AI expert is currently unavailable. Please try again later.")


ai_chat_service_impl = AIChatService()