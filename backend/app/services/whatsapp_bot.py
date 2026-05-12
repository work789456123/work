"""Gopu WhatsApp Bot — intent routing and conversation state machine.

Handles:
- Welcome menu with interactive buttons
- AI Diagnosis flow (reuses AIChatService)
- Appointment booking flow (multi-step state machine)
- Marketplace link
- Language detection (Hindi / English)
- Auto-account creation for WhatsApp users
"""

import json
import logging
import re
import secrets
from dataclasses import dataclass
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.crud.appointment import crud_appointment
from app.crud.user import crud_user, pwd_context
from app.crud.whatsapp_session import crud_whatsapp_session
from app.models.whatsapp_session import WhatsAppSession
from app.schemas.appointment import AppointmentCreate
from app.services.ai_chat_service import AIChatService
from app.services import whatsapp_service as wa

logger = logging.getLogger(__name__)

# Singleton AI service (same one used by the web chat)
_ai_service = AIChatService()

# ──────────────────────────────────────────────────────────────────────────────
# Language detection
# ──────────────────────────────────────────────────────────────────────────────

_DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")


def detect_language(text: str) -> str:
    """Simple heuristic: if text contains Devanagari script → Hindi, else English."""
    if _DEVANAGARI_RE.search(text):
        return "Hindi"
    return "English"


# ──────────────────────────────────────────────────────────────────────────────
# Symptom / animal detection for auto-diagnosis routing
# ──────────────────────────────────────────────────────────────────────────────

_ANIMAL_KEYWORDS = re.compile(
    r"\b(cow|dog|cat|goat|buffalo|sheep|horse|calf|bull|pig|chicken|hen|bird|rabbit|"
    r"gaay|bakri|bhains|kutte|kutta|billi|murgi)\b|"
    r"(गाय|भैंस|बकरी|कुत्ता|बिल्ली|मुर्गी|घोड़ा|भेड़|सूअर|बछड़ा)",
    re.I,
)

_SYMPTOM_KEYWORDS = re.compile(
    r"\b(fever|vomit|cough|diarr|blood|wound|not eating|lame|swollen|pain|sick|ill|"
    r"bleeding|breathing|seizure|poison|bloat)\b|"
    r"(बुखार|उल्टी|खांसी|दस्त|खून|घाव|खाना नहीं|दर्द|बीमार|सूजन|सांस)",
    re.I,
)


def _looks_like_symptom(text: str) -> bool:
    """Return True if the message contains both an animal AND a symptom mention."""
    return bool(_ANIMAL_KEYWORDS.search(text)) and bool(_SYMPTOM_KEYWORDS.search(text))


def _looks_like_animal_query(text: str) -> bool:
    """Return True if the message mentions an animal at all — even without a clear symptom,
    we should route to diagnosis rather than re-show the menu."""
    return bool(_ANIMAL_KEYWORDS.search(text)) or bool(_SYMPTOM_KEYWORDS.search(text))


# ──────────────────────────────────────────────────────────────────────────────
# Tiny data class so the AI service can consume chat history
# ──────────────────────────────────────────────────────────────────────────────

@dataclass
class _FakeMessage:
    role: str
    content: str


# ──────────────────────────────────────────────────────────────────────────────
# Text constants (bilingual)
# ──────────────────────────────────────────────────────────────────────────────

_LANG_PICKER = {
    "body": "Welcome to PashuVaani! Please choose your language.\n\nपाशुवाणी में आपका स्वागत है! कृपया अपनी भाषा चुनें।",
    "buttons": [
        {"id": "lang_en", "title": "English"},
        {"id": "lang_hi", "title": "Hindi / हिंदी"},
    ]
}

_WELCOME = {
    "English": (
        "🐾 *Welcome to PashuVaani!*\n"
        "I'm *Gopu*, your AI animal health assistant.\n\n"
        "How can I help you today?"
    ),
    "Hindi": (
        "🐾 *पाशुवाणी में आपका स्वागत है!*\n"
        "मैं *गोपु* हूँ, आपका AI पशु स्वास्थ्य सहायक।\n\n"
        "आज मैं आपकी कैसे मदद कर सकता हूँ?"
    ),
}

_BUTTONS_MENU = {
    "English": [
        {"id": "diagnosis", "title": "🩺 AI Diagnosis"},
        {"id": "book_vet", "title": "📅 Book a Vet"},
        {"id": "shop", "title": "🛒 Shop Products"},
    ],
    "Hindi": [
        {"id": "diagnosis", "title": "🩺 AI निदान"},
        {"id": "book_vet", "title": "📅 डॉक्टर से मिलें"},
        {"id": "shop", "title": "🛒 उत्पाद खरीदें"},
    ],
}

_DIAGNOSIS_START = {
    "English": (
        "Please describe your animal and the symptoms you're seeing.\n"
        "For example: _\"My dog has been vomiting since yesterday\"_"
    ),
    "Hindi": (
        "कृपया अपने जानवर और उसके लक्षणों के बारे में बताएं।\n"
        "उदाहरण: _\"मेरी गाय को कल से बुखार है\"_"
    ),
}

_BOOKING_PROMPTS = {
    "pet_name": {
        "English": "What is your pet/animal's name?",
        "Hindi": "आपके जानवर/पालतू का नाम क्या है?",
    },
    "pet_type": {
        "English": "What type of animal? (e.g., Dog, Cat, Cow, Buffalo, Goat)",
        "Hindi": "किस प्रकार का जानवर है? (जैसे कुत्ता, बिल्ली, गाय, भैंस, बकरी)",
    },
    "gender": {
        "English": "What is the gender? (Male / Female)",
        "Hindi": "लिंग क्या है? (नर / मादा)",
    },
    "owner_name": {
        "English": "What is the owner's name?",
        "Hindi": "मालिक का नाम क्या है?",
    },
    "owner_number": {
        "English": "Please provide a contact phone number.",
        "Hindi": "कृपया संपर्क फ़ोन नंबर दें।",
    },
    "time_slot": {
        "English": "When would you like the appointment?\nPlease type your preferred date and time.\n_Example: Tomorrow 10 AM, 15 May 3 PM_",
        "Hindi": "अपॉइंटमेंट कब चाहिए?\nकृपया अपनी पसंदीदा तारीख और समय लिखें।\n_उदाहरण: कल सुबह 10 बजे, 15 मई दोपहर 3 बजे_",
    },
    "confirm": {
        "English": "Please review your appointment details:\n\n{summary}\n\nIs this correct?",
        "Hindi": "कृपया अपॉइंटमेंट की जानकारी जांचें:\n\n{summary}\n\nक्या यह सही है?",
    },
}

_BOOKING_SAVED = {
    "English": (
        "✅ *Appointment booked successfully!*\n\n"
        "Our team will contact you shortly to confirm.\n"
        "You can also track your appointment on the PashuVaani website."
    ),
    "Hindi": (
        "✅ *अपॉइंटमेंट सफलतापूर्वक बुक हो गई!*\n\n"
        "हमारी टीम जल्द ही आपसे संपर्क करेगी।\n"
        "आप PashuVaani वेबसाइट पर भी अपनी अपॉइंटमेंट ट्रैक कर सकते हैं।"
    ),
}

_SHOP_MSG = {
    "English": (
        "🛒 Visit the *PashuVaani Marketplace* for quality animal health products:\n\n"
        "👉 https://pashuvaani.com/marketplace\n\n"
        "Looking for something specific? Just tell me! "
        "(e.g., cattle feed, dog shampoo, vitamins)"
    ),
    "Hindi": (
        "🛒 गुणवत्ता वाले पशु स्वास्थ्य उत्पादों के लिए *पाशुवाणी मार्केटप्लेस* पर जाएं:\n\n"
        "👉 https://pashuvaani.com/marketplace\n\n"
        "कुछ खास चाहिए? बस बताइए! "
        "(जैसे पशु आहार, कुत्ते का शैम्पू, विटामिन)"
    ),
}

_ESCALATION = {
    "English": (
        "⚠️ *This seems serious and needs immediate veterinary attention.*\n"
        "I strongly recommend booking a vet appointment right away."
    ),
    "Hindi": (
        "⚠️ *यह गंभीर लगता है और तुरंत पशु चिकित्सक की जरूरत है।*\n"
        "मैं आपको अभी डॉक्टर की अपॉइंटमेंट बुक करने की सलाह देता हूँ।"
    ),
}

_RESET_MSG = {
    "English": "No problem! What else can I help you with?",
    "Hindi": "कोई बात नहीं! और किस तरह मदद कर सकता हूँ?",
}


# ──────────────────────────────────────────────────────────────────────────────
# Auto-account creation
# ──────────────────────────────────────────────────────────────────────────────

async def _ensure_user(db: AsyncSession, phone_number: str) -> str:
    """Find or create a PashuVaani user account for this WhatsApp phone number.
    Returns the user.id."""
    # Normalise the phone number as the email-equivalent identifier
    identifier = f"+{phone_number}" if not phone_number.startswith("+") else phone_number

    user = await crud_user.get_by_phone_or_email(db, phone_or_email=identifier)
    if user:
        return user.id

    # Auto-create with a random password (user can reset later if they log in to the website)
    from app.models.user import User
    random_password = secrets.token_urlsafe(16)
    new_user = User(
        full_name=f"WhatsApp User {phone_number[-4:]}",
        phone_or_email=identifier,
        hashed_password=pwd_context.hash(random_password),
        role="user",
        is_verified=True,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    logger.info("Auto-created user %s for WhatsApp phone %s", new_user.id, phone_number)
    return new_user.id


# ──────────────────────────────────────────────────────────────────────────────
# Main handler — called from the webhook endpoint
# ──────────────────────────────────────────────────────────────────────────────

async def handle_message(db: AsyncSession, phone_number: str, message_body: str, message_id: str) -> None:
    """Central entry point. Processes an incoming WhatsApp message and sends replies."""

    # 1. Mark the message as read (blue ticks)
    await wa.mark_as_read(message_id)

    # 2. Detect language
    lang = detect_language(message_body)

    # 3. Get or create the WhatsApp session
    session = await crud_whatsapp_session.get_or_create(db, phone_number)
    await crud_whatsapp_session.set_language(db, session, lang)

    # 4. Ensure a PashuVaani user account exists
    if not session.user_id:
        user_id = await _ensure_user(db, phone_number)
        await crud_whatsapp_session.set_user_id(db, session, user_id)
        # Refresh session to get updated user_id
        session = await crud_whatsapp_session.get_by_phone(db, phone_number)

    # 5. Route based on current state
    state = session.state
    text = message_body.strip()
    text_lower = text.lower()

    # ── Handle language selection buttons ──
    if text_lower == "lang_en":
        await crud_whatsapp_session.set_language(db, session, "English")
        await crud_whatsapp_session.update_state(db, session, "idle")
        await _send_welcome_menu(phone_number, "English")
        return

    if text_lower == "lang_hi":
        await crud_whatsapp_session.set_language(db, session, "Hindi")
        await crud_whatsapp_session.update_state(db, session, "idle")
        await _send_welcome_menu(phone_number, "Hindi")
        return

    # ── Handle button clicks ──
    if text_lower in ("diagnosis", "ai diagnosis", "🩺 ai diagnosis", "🩺 ai निदान", "gopu ai diagnosis"):
        await _start_diagnosis(db, session, phone_number, lang)
        return

    if text_lower in ("book_vet", "book a vet", "📅 book a vet", "📅 डॉक्टर से मिलें", "book a vet doctor"):
        await _start_booking(db, session, phone_number, lang)
        return

    if text_lower in ("shop", "shop products", "🛒 shop products", "🛒 उत्पाद खरीदें", "shop health products"):
        await _handle_shop(db, session, phone_number, lang)
        return

    # ── Handle booking confirmation buttons ──
    if text_lower == "confirm_yes" and state == "booking_confirm":
        await _continue_booking(db, session, phone_number, "yes", lang)
        return

    if text_lower == "confirm_no" and state == "booking_confirm":
        await _continue_booking(db, session, phone_number, "no", lang)
        return

    # ── Cancel / reset at any point ──
    if text_lower in ("cancel", "reset", "menu", "start", "hi", "hello", "namaste", "नमस्ते", "हेलो"):
        await crud_whatsapp_session.reset(db, session)
        await _send_language_picker(phone_number)
        return

    # ── State-based routing ──
    if state == "diagnosing":
        await _continue_diagnosis(db, session, phone_number, text, lang)
        return

    if state.startswith("booking_"):
        await _continue_booking(db, session, phone_number, text, lang)
        return

    # ── Idle — detect intent from free text ──
    if _looks_like_symptom(text) or _looks_like_animal_query(text):
        # Skip menu, go straight to diagnosis
        await crud_whatsapp_session.update_state(db, session, "diagnosing")
        await _continue_diagnosis(db, session, phone_number, text, lang)
        return

    # Default: show language picker if idle
    if state == "idle" and not text_lower:
        await _send_language_picker(phone_number)
        return

    await _send_welcome_menu(phone_number, lang)


# ──────────────────────────────────────────────────────────────────────────────
# Menu & Language
# ──────────────────────────────────────────────────────────────────────────────

async def _send_language_picker(phone: str) -> None:
    await wa.send_interactive_buttons(
        to=phone,
        body=_LANG_PICKER["body"],
        buttons=_LANG_PICKER["buttons"],
        footer="PashuVaani 🐾",
    )

async def _send_welcome_menu(phone: str, lang: str) -> None:
    await wa.send_interactive_buttons(
        to=phone,
        body=_WELCOME[lang],
        buttons=_BUTTONS_MENU[lang],
        footer="PashuVaani 🐾",
    )


# ──────────────────────────────────────────────────────────────────────────────
# Diagnosis flow
# ──────────────────────────────────────────────────────────────────────────────

async def _start_diagnosis(db: AsyncSession, session: WhatsAppSession, phone: str, lang: str) -> None:
    await crud_whatsapp_session.update_state(db, session, "diagnosing")
    await wa.send_text(phone, _DIAGNOSIS_START[lang])


async def _continue_diagnosis(db: AsyncSession, session: WhatsAppSession, phone: str, text: str, lang: str) -> None:
    """Send user message to AI and relay the response."""
    # Append user message to history
    await crud_whatsapp_session.append_chat_history(db, session, "user", text)

    # Build history objects the AI service expects
    raw_history = crud_whatsapp_session.get_chat_history(session)
    history_objects = [_FakeMessage(role=m["role"], content=m["content"]) for m in raw_history]

    try:
        ai_result = await _ai_service.get_response(
            user_message=text,
            chat_history=history_objects,
            language=lang,
        )
        reply = ai_result.get("response", "I'm sorry, I couldn't process that. Please try again.")
        severity = ai_result.get("severity", "low")
    except Exception as exc:
        logger.error("AI diagnosis error: %s", exc)
        reply = (
            "माफ़ कीजिए, अभी तकनीकी समस्या है। कृपया कुछ देर बाद कोशिश करें।"
            if lang == "Hindi"
            else "Sorry, I'm experiencing a technical issue. Please try again shortly."
        )
        severity = "low"

    # Append AI reply to history
    await crud_whatsapp_session.append_chat_history(db, session, "assistant", reply)

    # Send the AI response
    await wa.send_text(phone, reply)

    # If critical — escalate with a "Book Vet" button
    if severity == "critical":
        escalation_buttons = [
            {"id": "book_vet", "title": "📅 Book a Vet" if lang == "English" else "📅 डॉक्टर बुक करें"},
        ]
        await wa.send_interactive_buttons(
            to=phone,
            body=_ESCALATION[lang],
            buttons=escalation_buttons,
        )


# ──────────────────────────────────────────────────────────────────────────────
# Booking flow (multi-step state machine)
# ──────────────────────────────────────────────────────────────────────────────

_BOOKING_STEPS = [
    "booking_pet_name",
    "booking_pet_type",
    "booking_gender",
    "booking_owner_name",
    "booking_owner_number",
    "booking_time_slot",
    "booking_confirm",
]

_STEP_TO_DATA_KEY = {
    "booking_pet_name": "pet_name",
    "booking_pet_type": "pet_type",
    "booking_gender": "gender",
    "booking_owner_name": "owner_name",
    "booking_owner_number": "owner_number",
    "booking_time_slot": "time_slot",
}


async def _start_booking(db: AsyncSession, session: WhatsAppSession, phone: str, lang: str) -> None:
    """Begin the booking flow by asking for the pet name."""
    await crud_whatsapp_session.update_state(db, session, "booking_pet_name", state_data={})
    await wa.send_text(phone, _BOOKING_PROMPTS["pet_name"][lang])


async def _continue_booking(db: AsyncSession, session: WhatsAppSession, phone: str, text: str, lang: str) -> None:
    """Process the current booking step and advance to the next."""
    state = session.state
    data = crud_whatsapp_session.get_state_data(session)

    if state == "booking_confirm":
        # User is confirming or rejecting
        if text.lower() in ("yes", "y", "haan", "हाँ", "ha", "correct", "confirm", "ok", "sahi"):
            await _save_appointment(db, session, phone, data, lang)
        else:
            await crud_whatsapp_session.reset(db, session)
            await wa.send_text(phone, _RESET_MSG[lang])
            await _send_welcome_menu(phone, lang)
        return

    # Save the answer for the current step
    data_key = _STEP_TO_DATA_KEY.get(state)
    if data_key:
        data[data_key] = text

    # Find the next step
    try:
        current_idx = _BOOKING_STEPS.index(state)
    except ValueError:
        await crud_whatsapp_session.reset(db, session)
        await _send_welcome_menu(phone, lang)
        return

    next_step = _BOOKING_STEPS[current_idx + 1]
    await crud_whatsapp_session.update_state(db, session, next_step, state_data=data)

    if next_step == "booking_confirm":
        # Show summary and ask for confirmation
        summary = (
            f"🐾 *Pet Name:* {data.get('pet_name', '-')}\n"
            f"🏷️ *Type:* {data.get('pet_type', '-')}\n"
            f"⚧ *Gender:* {data.get('gender', '-')}\n"
            f"👤 *Owner:* {data.get('owner_name', '-')}\n"
            f"📞 *Phone:* {data.get('owner_number', '-')}\n"
            f"🕐 *Time:* {data.get('time_slot', '-')}"
        )
        confirm_text = _BOOKING_PROMPTS["confirm"][lang].format(summary=summary)
        await wa.send_interactive_buttons(
            to=phone,
            body=confirm_text,
            buttons=[
                {"id": "confirm_yes", "title": "✅ Yes" if lang == "English" else "✅ हाँ"},
                {"id": "confirm_no", "title": "❌ No" if lang == "English" else "❌ नहीं"},
            ],
        )
    else:
        # Ask the next question
        prompt_key = next_step.replace("booking_", "")
        prompt_text = _BOOKING_PROMPTS.get(prompt_key, {}).get(lang, "Please provide the details.")
        await wa.send_text(phone, prompt_text)


async def _save_appointment(
    db: AsyncSession,
    session: WhatsAppSession,
    phone: str,
    data: dict,
    lang: str,
) -> None:
    """Persist the appointment to DB, fire Slack notification, and reply to user."""
    import httpx
    from app.api.endpoints.appointments import send_slack_notification

    user_id = session.user_id
    if not user_id:
        user_id = await _ensure_user(db, phone)

    appointment_in = AppointmentCreate(
        pet_name=data.get("pet_name", "Unknown"),
        pet_type=data.get("pet_type", "Unknown"),
        gender=data.get("gender", "Unknown"),
        owner_name=data.get("owner_name", "WhatsApp User"),
        owner_number=data.get("owner_number", phone),
        time_slot=data.get("time_slot", "To be confirmed"),
        source="whatsapp",
    )

    db_appointment = await crud_appointment.create(db, appointment_in=appointment_in, user_id=user_id)

    # Fire Slack notification (same as website bookings)
    identifier = f"+{phone}" if not phone.startswith("+") else phone
    try:
        await send_slack_notification(db_appointment.id, appointment_in, f"WhatsApp: {identifier}")
    except Exception as exc:
        logger.error("Slack notification failed for WhatsApp booking: %s", exc)

    # Reset session
    await crud_whatsapp_session.reset(db, session)

    # Reply to user
    await wa.send_text(phone, _BOOKING_SAVED[lang])
    await _send_welcome_menu(phone, lang)


# ──────────────────────────────────────────────────────────────────────────────
# Shop
# ──────────────────────────────────────────────────────────────────────────────

async def _handle_shop(db: AsyncSession, session: WhatsAppSession, phone: str, lang: str) -> None:
    await crud_whatsapp_session.reset(db, session)
    await wa.send_text(phone, _SHOP_MSG[lang])
