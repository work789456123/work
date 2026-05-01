"""Minimal env defaults so importing `app` in tests does not require a real `.env` file."""

from __future__ import annotations

import os

os.environ.setdefault("SECRET_KEY", "unit-test-secret-key-unit-test-secret-key-01")
os.environ.setdefault(
    "DATABASE_URL",
    "postgresql+asyncpg://postgres:admin123@localhost:5432/pashuvaani",
)
os.environ.setdefault("OPENAI_API_KEY", "sk-test-not-used-in-offline-tests")
os.environ.setdefault("ADMIN_EMAIL", "admin@test.local")
os.environ.setdefault("ADMIN_PASSWORD", "test-admin-password-123")
