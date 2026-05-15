"""Ensure password_reset_otps exists; add missing appointments columns (prod repair).

Revision ID: 5f4e3d2c1b0a
Revises: b7463f1e9a2d
Create Date: 2026-05-13

Some databases reached current Alembic heads without applying earlier revisions
(e.g. fresh RDS). This revision idempotently creates OTP storage and extends
appointments so booking + forgot-password flows work after `alembic upgrade head`.
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision: str = "5f4e3d2c1b0a"
down_revision: Union[str, None] = "b7463f1e9a2d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _appointment_columns(bind) -> set[str]:
    insp = inspect(bind)
    if "appointments" not in insp.get_table_names():
        return set()
    return {c["name"] for c in insp.get_columns("appointments")}


def upgrade() -> None:
    bind = op.get_bind()
    insp = inspect(bind)

    if "password_reset_otps" not in insp.get_table_names():
        op.create_table(
            "password_reset_otps",
            sa.Column("id", sa.String(), nullable=False),
            sa.Column("email", sa.String(), nullable=False),
            sa.Column("otp_hash", sa.String(), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.Column("expires_at", sa.DateTime(), nullable=False),
            sa.Column("is_used", sa.Boolean(), nullable=False, server_default=sa.text("false")),
            sa.Column("attempts", sa.Integer(), nullable=False, server_default=sa.text("0")),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            op.f("ix_password_reset_otps_email"),
            "password_reset_otps",
            ["email"],
            unique=False,
        )

    cols = _appointment_columns(bind)
    if not cols:
        return

    if "complaint_id" not in cols:
        op.add_column("appointments", sa.Column("complaint_id", sa.String(), nullable=True))
    if "doctor_id" not in cols:
        op.add_column("appointments", sa.Column("doctor_id", sa.String(), nullable=True))
    if "notes" not in cols:
        op.add_column("appointments", sa.Column("notes", sa.Text(), nullable=True))
    if "created_at" not in cols:
        op.add_column("appointments", sa.Column("created_at", sa.DateTime(), nullable=True))
    if "updated_at" not in cols:
        op.add_column("appointments", sa.Column("updated_at", sa.DateTime(), nullable=True))
    if "is_deleted" not in cols:
        op.add_column("appointments", sa.Column("is_deleted", sa.Boolean(), nullable=True))

    if bind.dialect.name == "postgresql":
        op.execute(sa.text("UPDATE appointments SET is_deleted = false WHERE is_deleted IS NULL"))


def downgrade() -> None:
    # Non-destructive repair migration — no-op on downgrade.
    pass
