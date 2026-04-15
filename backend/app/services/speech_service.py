import os
import base64
import tempfile
import uuid
import logging
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

class SpeechService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = AsyncOpenAI(api_key=self.api_key)

    async def transcribe_audio(self, audio_base64: str, language: str = None) -> str:
        """Transcribe base64 encoded audio using OpenAI Whisper."""
        try:
            audio_data = base64.b64decode(audio_base64.split(",")[1] if "," in audio_base64 else audio_base64)
            # Default to webm as it's common for browser recordings, unless explicitly wav
            extension = ".wav" if "wav" in audio_base64[:50].lower() else ".webm"
            temp_filename = f"temp_{uuid.uuid4()}{extension}"
            
            with open(temp_filename, "wb") as f:
                f.write(audio_data)
                
            try:
                with open(temp_filename, "rb") as audio_file:
                    kwargs = {"model": "whisper-1", "file": audio_file}
                    if language:
                        kwargs["language"] = language
                    response = await self.client.audio.transcriptions.create(**kwargs)
                return response.text
            finally:
                if os.path.exists(temp_filename):
                    os.remove(temp_filename)
        except Exception as e:
            logger.error(f"Error in transcription: {e}")
            raise Exception(f"Failed to transcribe audio: {str(e)}")

    async def synthesize_speech(self, text: str) -> str:
        """Convert text to speech using OpenAI TTS and return as base64 audio."""
        try:
            # Using the modern response.content or writing to temp file
            response = await self.client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=text
            )
            
            # Retrieve bytes from response.content (OpenAI's Async client returns pre-read content here)
            audio_data = response.content
            base64_audio = base64.b64encode(audio_data).decode("utf-8")
            return f"data:audio/mp3;base64,{base64_audio}"
            
        except Exception as e:
            logger.error(f"Error in speech synthesis: {e}")
            raise Exception(f"Speech synthesis error: {str(e)}")

speech_service_impl = SpeechService()
