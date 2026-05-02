"""add password_reset_otps table

Revision ID: a1b2c3d4e5f6
Revises: c3f4d2a1b9e0
Create Date: 2026-05-02 05:45:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'd91b6c2a7f41'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'password_reset_otps',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('otp_hash', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('is_used', sa.Boolean(), nullable=False, server_default=sa.text('false')),
        sa.Column('attempts', sa.Integer(), nullable=False, server_default=sa.text('0')),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(
        op.f('ix_password_reset_otps_email'),
        'password_reset_otps',
        ['email'],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f('ix_password_reset_otps_email'),
        table_name='password_reset_otps',
    )
    op.drop_table('password_reset_otps')
