"""add title, summary, updated_at to chat_sessions

Revision ID: a3b4c5d6e7f8
Revises: f1e0d9c8b7a6
Create Date: 2026-05-10 14:00:00.000000
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "a3b4c5d6e7f8"
down_revision: Union[str, None] = "f1e0d9c8b7a6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("chat_sessions", sa.Column("title", sa.String(200), nullable=True))
    op.add_column("chat_sessions", sa.Column("summary", sa.Text(), nullable=True))
    op.add_column("chat_sessions", sa.Column("updated_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    op.drop_column("chat_sessions", "updated_at")
    op.drop_column("chat_sessions", "summary")
    op.drop_column("chat_sessions", "title")
