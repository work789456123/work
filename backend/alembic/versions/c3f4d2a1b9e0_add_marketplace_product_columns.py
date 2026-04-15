"""add marketplace product columns

Revision ID: c3f4d2a1b9e0
Revises: 8a2e1c9d4b3f
Create Date: 2026-04-10 14:52:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c3f4d2a1b9e0"
down_revision: Union[str, Sequence[str], None] = "8a2e1c9d4b3f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "products",
        sa.Column("category", sa.String(), nullable=False, server_default="Feed & Fodder"),
    )
    op.add_column("products", sa.Column("image1", sa.String(), nullable=True))
    op.add_column("products", sa.Column("image2", sa.String(), nullable=True))
    op.add_column(
        "products",
        sa.Column("contact", sa.String(), nullable=False, server_default="+917073041236"),
    )

    op.execute("UPDATE products SET image1 = image_url WHERE image1 IS NULL")

    op.alter_column("products", "category", server_default=None)
    op.alter_column("products", "contact", server_default=None)


def downgrade() -> None:
    op.drop_column("products", "contact")
    op.drop_column("products", "image2")
    op.drop_column("products", "image1")
    op.drop_column("products", "category")
