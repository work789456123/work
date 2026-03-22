"""Add ratelimit exceptions table

Revision ID: 8a2e1c9d4b3f
Revises: 0f2d5083ce3f
Create Date: 2026-03-20 10:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8a2e1c9d4b3f'
down_revision: Union[str, None] = '0f2d5083ce3f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('ratelimit_exceptions',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('reason', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ratelimit_exceptions_email'), 'ratelimit_exceptions', ['email'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_ratelimit_exceptions_email'), table_name='ratelimit_exceptions')
    op.drop_table('ratelimit_exceptions')
