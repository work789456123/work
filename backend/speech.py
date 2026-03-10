import os
from dotenv import load_dotenv
import base64
from io import BytesIO
import asyncio
from openai import AsyncOpenAI

load_dotenv()

class SpeechService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=self.api_key)
    
    async def transcribe_audio(self, audio_base64: str, language: str = "hi") -> str:
        """Transcribe audio to text using OpenAI Whisper"""
        try:
            # Decode base64 to bytes
            audio_bytes = base64.b64decode(audio_base64)
            audio_file = ("audio.webm", audio_bytes, "audio/webm")
            
            # Transcribe, enforce Hindi if language is hi
            response = await self.client.audio.transcriptions.create(
                file=audio_file,
                model="whisper-1",
                response_format="text",
                language=language
            )
            
            return response
        except Exception as e:
            raise Exception(f"Speech transcription error: {str(e)}")
            
    async def synthesize_speech(self, text: str) -> str:
        """Synthesize text to speech using OpenAI TTS, returns base64 audio"""
        try:
            response = await self.client.audio.speech.create(
                model="tts-1",
                voice="alloy", # alloy is a good neutral voice that works ok with Hindi
                input=text,
                response_format="mp3"
            )
            
            # Read the bytes and convert to base64
            audio_bytes = response.read()
            return base64.b64encode(audio_bytes).decode('utf-8')
        except Exception as e:
            raise Exception(f"Speech synthesis error: {str(e)}")

speech_service = SpeechService()