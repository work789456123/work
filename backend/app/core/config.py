import os
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "PashuVaani API (PostgreSQL)"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days
    DATABASE_URL: str
    OPENAI_API_KEY: str
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    CORS_ORIGINS: str = "*"
    BACKEND_PUBLIC_URL: str = "http://localhost:8000"

    # Email Settings
    SMTP_TLS: bool = True
    SMTP_PORT: Optional[int] = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = "noreply@pashuvaani.com"
    EMAILS_FROM_NAME: Optional[str] = "PashuVaani"
    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAILS_ENABLED: bool = False



    # Frontend URL for links in emails
    FRONTEND_HOST: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")



settings = Settings()
