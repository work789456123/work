import os
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

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
