"""Telegram Bot Brain — using Groq for ultra-fast diagnostics."""

import json
import logging
import secrets
from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession
from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup, Update

from app.core.config import settings
from app.crud.appointment import crud_appointment
from app.crud.user import crud_user, pwd_context
from app.crud.telegram_session import crud_telegram_session
from app.models.telegram_session import TelegramSession
from app.schemas.appointment import AppointmentCreate
from app.services.groq_service import groq_chat_service

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────────────────────
# Constants
# ──────────────────────────────────────────────────────────────────────────────

_LANG_PICKER = {
    "body": (
        "🐾 Welcome to PashuVaani!\n"
        "Your AI animal health assistant — Gopu\n\n"
        "━━━━━━━━━━━━━━━━━━━━━━\n"
        "🌐 Please choose your language\n"
        "🇮🇳 कृपया अपनी भाषा चुनें"
    ),
    "buttons": [
        [InlineKeyboardButton("🇬🇧 English", callback_data="lang_en")],
        [InlineKeyboardButton("🇮🇳 हिंदी (Hindi)", callback_data="lang_hi")],
    ]
}

_WELCOME = {
    "English": "🐾 *Welcome to PashuVaani\\!*\nI'm *Gopu*, your AI animal health assistant\\.\n\nHow can I help you today?",
    "Hindi": "🐾 *पाशुवाणी में आपका स्वागत है\\!*\nमैं *गोपु* हूँ, आपका AI पशु स्वास्थ्य सहायक।\n\nआज मैं आपकी कैसे मदद कर सकता हूँ?",
}

_MENU_BUTTONS = {
    "English": [
        [InlineKeyboardButton("🩺 AI Diagnosis", callback_data="diagnosis")],
        [InlineKeyboardButton("📅 Book a Vet", callback_data="book_vet")],
        [InlineKeyboardButton("🛒 Shop Products", callback_data="shop")],
    ],
    "Hindi": [
        [InlineKeyboardButton("🩺 AI निदान", callback_data="diagnosis")],
        [InlineKeyboardButton("📅 डॉक्टर से मिलें", callback_data="book_vet")],
        [InlineKeyboardButton("🛒 उत्पाद खरीदें", callback_data="shop")],
    ],
}

_DIAGNOSIS_START = {
    "English": "Please describe your animal and the symptoms you're seeing.\nExample: *My dog has been vomiting since yesterday*",
    "Hindi": "कृपया अपने जानवर और उसके लक्षणों के बारे में बताएं।\nउदाहरण: *मेरी गाय को कल से बुखार है*",
}

_BOOKING_PROMPTS = {
    "pet_name": {"English": "🐾 What is your pet/animal's name?", "Hindi": "🐾 आपके जानवर का नाम क्या है?"},
    "pet_type": {"English": "🏷️ What type of animal? (Dog, Cat, Cow, Buffalo, Goat)", "Hindi": "🏷️ किस प्रकार का जानवर है? (कुत्ता, बिल्ली, गाय, भैंस, बकरी)"},
    "gender": {"English": "⚧ Gender? (Male / Female)", "Hindi": "⚧ लिंग? (नर / मादा)"},
    "owner_name": {"English": "👤 Owner's full name?", "Hindi": "👤 मालिक का पूरा नाम?"},
    "owner_number": {"English": "📞 Contact phone number?", "Hindi": "📞 संपर्क फ़ोन नंबर?"},
    "time_slot": {"English": "🕐 Preferred date and time?\nExample: Tomorrow 10 AM, 15 May 3 PM", "Hindi": "🕐 पसंदीदा तारीख और समय?\nउदाहरण: कल सुबह 10 बजे"},
}

_BOOKING_SAVED = {
    "English": "✅ *Appointment booked successfully!*\n\nOur team will contact you shortly.\nYou can also track your appointment on https://pashuvaani.com",
    "Hindi": "✅ *अपॉइंटमेंट सफलतापूर्वक बुक हो गई!*\n\nहमारी टीम जल्द ही आपसे संपर्क करेगी।",
}

_ERROR_MSG = {
    "English": "Sorry, I'm having a technical issue. Please try again in a moment.",
    "Hindi": "माफ़ कीजिए, अभी तकनीकी समस्या है। कृपया थोड़ी देर बाद कोशिश करें।",
}


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

@dataclass
class _FakeMessage:
    role: str
    content: str


async def _ensure_user(db: AsyncSession, chat_id: str, username: str | None = None) -> str:
    """Find or create a PashuVaani user account for this Telegram user."""
    identifier = f"telegram_{chat_id}"
    user = await crud_user.get_by_phone_or_email(db, phone_or_email=identifier)
    if user:
        return user.id

    from app.models.user import User
    random_password = secrets.token_urlsafe(16)
    display_name = f"Telegram {username or chat_id}"
    new_user = User(
        full_name=display_name,
        phone_or_email=identifier,
        hashed_password=pwd_context.hash(random_password),
        role="user",
        is_verified=True,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    logger.info("Auto-created user %s for Telegram chat %s", new_user.id, chat_id)
    return new_user.id


# ──────────────────────────────────────────────────────────────────────────────
# Main Handler
# ──────────────────────────────────────────────────────────────────────────────

async def handle_telegram_update(db: AsyncSession, update: Update, bot: Bot) -> None:
    """Processes an incoming Telegram update."""

    # Extract chat_id and message/callback data
    if update.message:
        chat_id = str(update.message.chat_id)
        text = update.message.text or ""
        callback_data = None
        username = update.message.from_user.username if update.message.from_user else None
    elif update.callback_query:
        chat_id = str(update.callback_query.message.chat_id)
        text = ""
        callback_data = update.callback_query.data
        username = update.callback_query.from_user.username if update.callback_query.from_user else None
        await update.callback_query.answer()
    else:
        return

    session = await crud_telegram_session.get_or_create(db, chat_id)
    lang = session.language
    state = session.state

    # Ensure user account exists
    if not session.user_id:
        user_id = await _ensure_user(db, chat_id, username)
        session.user_id = user_id
        await db.commit()

    # ── 0. FIRST THING: If no language selected yet, show picker for ANY message ──
    if state == "awaiting_language" and not callback_data:
        await _send_lang_picker(bot, chat_id)
        return

    # ── 1. Commands & Resets ──
    if text.startswith("/start") or text.lower() in ("reset", "menu", "cancel", "/menu"):
        await crud_telegram_session.reset(db, session)
        await _send_lang_picker(bot, chat_id)
        return

    # ── 2. Language Selection ──
    if callback_data == "lang_en":
        await crud_telegram_session.set_language(db, session, "English")
        await crud_telegram_session.update_state(db, session, "idle")
        await _send_menu(bot, chat_id, "English")
        return
    if callback_data == "lang_hi":
        await crud_telegram_session.set_language(db, session, "Hindi")
        await crud_telegram_session.update_state(db, session, "idle")
        await _send_menu(bot, chat_id, "Hindi")
        return

    # ── 3. Main Menu Buttons ──
    if callback_data == "diagnosis":
        await crud_telegram_session.update_state(db, session, "diagnosing")
        await bot.send_message(chat_id=chat_id, text=_DIAGNOSIS_START[lang], parse_mode="Markdown")
        return

    if callback_data == "book_vet":
        await _start_booking(db, session, bot, chat_id, lang)
        return

    if callback_data == "shop":
        await bot.send_message(chat_id=chat_id, text="🛒 https://pashuvaani.com/marketplace")
        return

    # ── 4. Booking Confirmation Button ──
    if callback_data == "conf_yes":
        data = crud_telegram_session.get_state_data(session)
        await _save_appointment(db, session, bot, chat_id, data, lang)
        return

    if callback_data == "conf_no":
        await crud_telegram_session.reset(db, session)
        await bot.send_message(chat_id=chat_id, text="No problem! What else can I help you with?" if lang == "English" else "कोई बात नहीं! और किस तरह मदद कर सकता हूँ?")
        await _send_menu(bot, chat_id, lang)
        return

    # ── 5. State-based routing ──
    if state == "diagnosing" and text:
        await _handle_diagnosis(db, session, bot, chat_id, text, lang)
        return

    if state.startswith("booking_") and state != "booking_confirm" and text:
        await _handle_booking(db, session, bot, chat_id, text, lang)
        return

    # ── Default: Show language picker or menu ──
    if state == "idle":
        await _send_lang_picker(bot, chat_id)
    else:
        await _send_menu(bot, chat_id, lang)


# ──────────────────────────────────────────────────────────────────────────────
# Menu
# ──────────────────────────────────────────────────────────────────────────────
async def _send_lang_picker(bot: Bot, chat_id: str) -> None:
    await bot.send_message(
        chat_id=chat_id,
        text=_LANG_PICKER["body"],
        reply_markup=InlineKeyboardMarkup(_LANG_PICKER["buttons"])
    )


async def _send_menu(bot: Bot, chat_id: str, lang: str) -> None:
    await bot.send_message(
        chat_id=chat_id,
        text=_WELCOME[lang],
        reply_markup=InlineKeyboardMarkup(_MENU_BUTTONS[lang]),
        parse_mode="MarkdownV2"
    )


# ──────────────────────────────────────────────────────────────────────────────
# AI Diagnosis — Groq powered
# ──────────────────────────────────────────────────────────────────────────────

async def _handle_diagnosis(db: AsyncSession, session: TelegramSession, bot: Bot, chat_id: str, text: str, lang: str) -> None:
    await crud_telegram_session.append_chat_history(db, session, "user", text)
    history = crud_telegram_session.get_chat_history(session)
    history_objects = [_FakeMessage(role=m["role"], content=m["content"]) for m in history]

    try:
        result = await groq_chat_service.get_response(text, history_objects, lang)
        reply = result["response"]
        severity = result.get("severity", "low")
        await crud_telegram_session.append_chat_history(db, session, "assistant", reply)

        # Detect if AI is suggesting a vet visit
        vet_keywords_en = ["consult a vet", "see a vet", "visit a vet", "veterinarian", "book a vet", "vet immediately", "veterinary", "recommend a vet", "professional help"]
        vet_keywords_hi = ["पशु चिकित्सक", "डॉक्टर से मिलें", "डॉक्टर को दिखाएं", "वेट से मिलें", "पशु डॉक्टर"]
        
        reply_lower = reply.lower()
        suggests_vet = (
            severity == "critical" or
            any(kw in reply_lower for kw in vet_keywords_en) or
            any(kw in reply for kw in vet_keywords_hi)
        )

        if suggests_vet:
            label = "⚠️ It seems your animal needs professional care." if lang == "English" else "⚠️ आपके जानवर को पेशेवर देखभाल की जरूरत है।"
            await bot.send_message(chat_id=chat_id, text=reply)
            await bot.send_message(
                chat_id=chat_id,
                text=label,
                reply_markup=InlineKeyboardMarkup([[
                    InlineKeyboardButton("📅 Book a Vet" if lang == "English" else "📅 डॉक्टर से मिलें", callback_data="book_vet")
                ]])
            )
        else:
            await bot.send_message(chat_id=chat_id, text=reply)

    except Exception as exc:
        logger.error("Groq diagnosis error for chat %s: %s", chat_id, exc, exc_info=True)
        await bot.send_message(chat_id=chat_id, text=_ERROR_MSG[lang])



# ──────────────────────────────────────────────────────────────────────────────
# Appointment Booking — multi-step
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
_STEP_KEYS = ["pet_name", "pet_type", "gender", "owner_name", "owner_number", "time_slot"]


async def _start_booking(db: AsyncSession, session: TelegramSession, bot: Bot, chat_id: str, lang: str) -> None:
    await crud_telegram_session.update_state(db, session, "booking_pet_name", state_data={})
    await bot.send_message(chat_id=chat_id, text=_BOOKING_PROMPTS["pet_name"][lang])


async def _handle_booking(db: AsyncSession, session: TelegramSession, bot: Bot, chat_id: str, text: str, lang: str) -> None:
    state = session.state
    data = crud_telegram_session.get_state_data(session)

    try:
        current_idx = _BOOKING_STEPS.index(state)
    except ValueError:
        await crud_telegram_session.reset(db, session)
        await _send_menu(bot, chat_id, lang)
        return

    # Save the answer
    data[_STEP_KEYS[current_idx]] = text

    next_state = _BOOKING_STEPS[current_idx + 1]
    await crud_telegram_session.update_state(db, session, next_state, state_data=data)

    if next_state == "booking_confirm":
        # Show full summary + Confirm/Cancel buttons
        summary = (
            f"🐾 *Pet Name:* {data.get('pet_name', '-')}\n"
            f"🏷️ *Type:* {data.get('pet_type', '-')}\n"
            f"⚧ *Gender:* {data.get('gender', '-')}\n"
            f"👤 *Owner:* {data.get('owner_name', '-')}\n"
            f"📞 *Phone:* {data.get('owner_number', '-')}\n"
            f"🕐 *Time:* {data.get('time_slot', '-')}"
        )
        confirm_label = "Please review your appointment:\n\n" if lang == "English" else "कृपया अपॉइंटमेंट की जानकारी जांचें:\n\n"
        await bot.send_message(
            chat_id=chat_id,
            text=confirm_label + summary,
            parse_mode="Markdown",
            reply_markup=InlineKeyboardMarkup([
                [
                    InlineKeyboardButton("✅ Confirm" if lang == "English" else "✅ हाँ", callback_data="conf_yes"),
                    InlineKeyboardButton("❌ Cancel" if lang == "English" else "❌ नहीं", callback_data="conf_no"),
                ]
            ])
        )
    else:
        next_prompt = next_state.replace("booking_", "")
        await bot.send_message(chat_id=chat_id, text=_BOOKING_PROMPTS[next_prompt][lang])


async def _save_appointment(db: AsyncSession, session: TelegramSession, bot: Bot, chat_id: str, data: dict, lang: str) -> None:
    """Save appointment to DB and fire Slack notification."""
    from app.api.endpoints.appointments import send_slack_notification

    user_id = session.user_id
    if not user_id:
        user_id = await _ensure_user(db, chat_id)

    appointment_in = AppointmentCreate(
        pet_name=data.get("pet_name", "Unknown"),
        pet_type=data.get("pet_type", "Unknown"),
        gender=data.get("gender", "Unknown"),
        owner_name=data.get("owner_name", "Telegram User"),
        owner_number=data.get("owner_number", chat_id),
        time_slot=data.get("time_slot", "To be confirmed"),
        source="telegram",
    )

    try:
        db_appointment = await crud_appointment.create(db, appointment_in=appointment_in, user_id=user_id)
        logger.info("Telegram appointment created: %s", db_appointment.id)

        # Fire Slack notification
        try:
            await send_slack_notification(db_appointment.id, appointment_in, f"Telegram: {chat_id}")
        except Exception as slack_exc:
            logger.error("Slack notification failed for Telegram booking: %s", slack_exc)

    except Exception as exc:
        logger.error("Failed to save Telegram appointment: %s", exc, exc_info=True)
        await bot.send_message(chat_id=chat_id, text=_ERROR_MSG[lang])
        return

    # Reset session and reply to user
    await crud_telegram_session.reset(db, session)
    await bot.send_message(chat_id=chat_id, text=_BOOKING_SAVED[lang], parse_mode="Markdown")
    await _send_menu(bot, chat_id, lang)
