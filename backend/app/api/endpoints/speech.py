from fastapi import APIRouter
from app.schemas.chat import SpeechTranscribe, SpeechSynthesize
from app.services.speech_service import speech_service_impl

router = APIRouter()

@router.post("/transcribe")
async def transcribe(speech: SpeechTranscribe):
    text = await speech_service_impl.transcribe_audio(
        audio_base64=speech.audio_base64,
        language=speech.language
    )
    return {"text": text}

@router.post("/synthesize")
async def synthesize(speech: SpeechSynthesize):
    audio_b64 = await speech_service_impl.synthesize_speech(text=speech.text)
    return {"audio_base64": audio_b64}
