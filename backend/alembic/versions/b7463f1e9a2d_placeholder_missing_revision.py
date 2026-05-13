"""Placeholder for revision b7463f1e9a2d (present on some DBs, missing from repo).

Revision ID: b7463f1e9a2d
Revises: a3b4c5d6e7f8

Some environments have ``alembic_version`` stamped with ``b7463f1e9a2d`` from a branch or
local migration that never shipped in this repository. Alembic requires every stamped revision
to exist in ``versions/``. This file is a no-op bridge so ``alembic upgrade head`` can resolve
the graph and apply later revisions (e.g. ``5f4e3d2c1b0a``).
"""

from typing import Sequence, Union

revision: str = "b7463f1e9a2d"
down_revision: Union[str, None] = "a3b4c5d6e7f8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
