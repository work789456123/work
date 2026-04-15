"""make legacy price nullable

Revision ID: d91b6c2a7f41
Revises: c3f4d2a1b9e0
Create Date: 2026-04-10 15:05:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "d91b6c2a7f41"
down_revision: Union[str, Sequence[str], None] = "c3f4d2a1b9e0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "products",
        "price",
        existing_type=sa.Float(),
        nullable=True,
    )


def downgrade() -> None:
    op.execute("UPDATE products SET price = 0 WHERE price IS NULL")
    op.alter_column(
        "products",
        "price",
        existing_type=sa.Float(),
        nullable=False,
    )
