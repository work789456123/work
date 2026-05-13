"""Ensure chat_sessions has title, summary, updated_at (prod repair).

Revision ID: 8c7b6a5948e3
Revises: 5f4e3d2c1b0a
Create Date: 2026-05-13

Some databases never applied a3b4c5d6e7f8; Gopu chat then fails with
UndefinedColumnError on chat_sessions.title. Idempotent ADD COLUMN only.
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect

revision: str = "8c7b6a5948e3"
down_revision: Union[str, None] = "5f4e3d2c1b0a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    insp = inspect(bind)
    if "chat_sessions" not in insp.get_table_names():
        return
    cols = {c["name"] for c in insp.get_columns("chat_sessions")}
    if "title" not in cols:
        op.add_column("chat_sessions", sa.Column("title", sa.String(200), nullable=True))
    if "summary" not in cols:
        op.add_column("chat_sessions", sa.Column("summary", sa.Text(), nullable=True))
    if "updated_at" not in cols:
        op.add_column("chat_sessions", sa.Column("updated_at", sa.DateTime(), nullable=True))


def downgrade() -> None:
    pass
