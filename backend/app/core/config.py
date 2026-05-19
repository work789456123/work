from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "PashuVaani API (PostgreSQL)"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days
    DATABASE_URL: str
    OPENAI_API_KEY: str
    CORS_ORIGINS: str = "*"
    BACKEND_PUBLIC_URL: str = "http://localhost:8000"

    # AI Model Settings
    USE_MEDGEMMA: bool = True
    SAGEMAKER_ENDPOINT_NAME: str = "medgemma"
    AWS_REGION: str = "ap-south-1"

    # RAG / Qdrant
    QDRANT_URL: str = Field(default="http://localhost:6333", description="Qdrant HTTP API base URL")
    QDRANT_API_KEY: Optional[str] = None
    QDRANT_COLLECTION: str = "vet_reference"
    USE_QDRANT_RAG: bool = True
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    EMBEDDING_DIM: int = 1536
    RAG_TOP_K: int = 8

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
    # When True, logs the OTP at WARNING if email delivery failed (local debugging only; never in prod).
    LOG_OTP_ON_EMAIL_FAILURE: bool = False



    # Slack notifications
    SLACK_WEBHOOK_URL: Optional[str] = None
    SLACK_WEBHOOK_URL_APPOINTMENTS: Optional[str] = None
    SLACK_WEBHOOK_URL_EMERGENCIES: Optional[str] = None
    SLACK_WEBHOOK_URL_PET_CABS: Optional[str] = "https://hooks.slack.com/services/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"
    SLACK_SIGNING_SECRET: Optional[str] = None

    # WhatsApp Business API (Meta Cloud API)
    WHATSAPP_VERIFY_TOKEN: str = "pashuvaani_whatsapp_verify_2026"
    WHATSAPP_ACCESS_TOKEN: Optional[str] = None
    WHATSAPP_PHONE_NUMBER_ID: Optional[str] = None
    WHATSAPP_API_VERSION: str = "v21.0"

    # Groq API
    GROQ_API_KEY: Optional[str] = None

    # Telegram Bot
    TELEGRAM_BOT_TOKEN: Optional[str] = None
    TELEGRAM_VERIFY_TOKEN: str = "pashuvaani_telegram_verify_2026"

    # Frontend URL for links in emails
    FRONTEND_HOST: str = "http://localhost:3000"

    # S3 Storage Settings
    USE_S3: bool = False
    S3_BUCKET: Optional[str] = None
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_REGION: str = "ap-south-1"
    S3_CUSTOM_DOMAIN: Optional[str] = None  # e.g., "cdn.pashuvaani.com"

    # When true, skip `alembic upgrade head` on API startup (e.g. some tests / one-off scripts).
    SKIP_ALEMBIC_AT_STARTUP: bool = False

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_async_database_url(cls, v: object) -> str:
        if v is None or (isinstance(v, str) and not v.strip()):
            raise ValueError(
                "DATABASE_URL is empty. Set it to a valid async URL, e.g. "
                "postgresql+asyncpg://user:pass@host:5432/dbname"
            )
        if not isinstance(v, str):
            v = str(v)
        s = v.strip()
        if s in ("CHANGE_ME_DATABASE_URL", "postgresql://CHANGE_ME"):
            raise ValueError(
                "DATABASE_URL is still a placeholder. In Terraform, set backend_environment.DATABASE_URL "
                "to your RDS URL. Use postgresql+asyncpg://... or postgresql://... (the app upgrades the latter)."
            )
        # SQLAlchemy async engine expects the asyncpg driver in the URL scheme.
        if s.startswith("postgresql://") and not s.startswith("postgresql+asyncpg://"):
            return s.replace("postgresql://", "postgresql+asyncpg://", 1)
        if s.startswith("postgres://"):
            return s.replace("postgres://", "postgresql+asyncpg://", 1)
        return s


settings = Settings()
