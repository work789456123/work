"""add user_id to medical_emergencies

Revision ID: a2b3c4d5e6f7
Revises: c9153c74171b
Create Date: 2026-05-06 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a2b3c4d5e6f7'
down_revision: Union[str, None] = 'c9153c74171b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('medical_emergencies', sa.Column('user_id', sa.String(), nullable=True))
    op.create_foreign_key(
        'fk_medical_emergencies_user_id',
        'medical_emergencies', 'users',
        ['user_id'], ['id'],
        ondelete='SET NULL'
    )


def downgrade() -> None:
    op.drop_constraint('fk_medical_emergencies_user_id', 'medical_emergencies', type_='foreignkey')
    op.drop_column('medical_emergencies', 'user_id')
