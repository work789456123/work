"""merge heads

Revision ID: b1c2d3e4f5a6
Revises: a2b3c4d5e6f7, c9153c74171b
Create Date: 2026-05-06 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1c2d3e4f5a6'
down_revision: Union[str, None] = ('a2b3c4d5e6f7', 'c9153c74171b')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
