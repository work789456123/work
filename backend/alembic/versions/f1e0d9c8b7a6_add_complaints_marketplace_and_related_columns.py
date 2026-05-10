"""add complaints, marketplace tables; extend products and appointments

Revision ID: f1e0d9c8b7a6
Revises: a1b2c3d4e5f6
Create Date: 2026-05-10 12:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f1e0d9c8b7a6"
down_revision: Union[str, None] = "a1b2c3d4e5f6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("parent_id", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("is_deleted", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["parent_id"], ["categories.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_table(
        "sellers",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("store_name", sa.String(), nullable=False),
        sa.Column("store_description", sa.Text(), nullable=True),
        sa.Column("rating", sa.Numeric(3, 2), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("is_deleted", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id"),
    )

    op.create_table(
        "complaints",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("pet_id", sa.String(), nullable=True),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("symptoms", sa.Text(), nullable=True),
        sa.Column("priority", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.Column("updated_at", sa.DateTime(), nullable=True),
        sa.Column("is_deleted", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["pet_id"], ["pets.id"]),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_complaints_id"), "complaints", ["id"], unique=False)

    op.create_table(
        "complaint_logs",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("complaint_id", sa.String(), nullable=False),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("updated_by", sa.String(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["complaint_id"], ["complaints.id"]),
        sa.ForeignKeyConstraint(["updated_by"], ["users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )

    op.add_column("appointments", sa.Column("complaint_id", sa.String(), nullable=True))
    op.add_column("appointments", sa.Column("doctor_id", sa.String(), nullable=True))
    op.add_column("appointments", sa.Column("notes", sa.Text(), nullable=True))
    op.add_column("appointments", sa.Column("created_at", sa.DateTime(), nullable=True))
    op.add_column("appointments", sa.Column("updated_at", sa.DateTime(), nullable=True))
    op.add_column("appointments", sa.Column("is_deleted", sa.Boolean(), nullable=True))
    op.create_unique_constraint("uq_appointments_complaint_id", "appointments", ["complaint_id"])
    op.create_foreign_key(
        "fk_appointments_complaint_id_complaints",
        "appointments",
        "complaints",
        ["complaint_id"],
        ["id"],
    )
    op.create_foreign_key(
        "fk_appointments_doctor_id_doctors",
        "appointments",
        "doctors",
        ["doctor_id"],
        ["id"],
    )

    op.add_column("products", sa.Column("seller_id", sa.String(), nullable=True))
    op.add_column("products", sa.Column("category_id", sa.String(), nullable=True))
    op.add_column("products", sa.Column("stock_quantity", sa.Integer(), nullable=True))
    op.add_column("products", sa.Column("status", sa.String(), nullable=True))
    op.add_column("products", sa.Column("is_deleted", sa.Boolean(), nullable=True))
    op.add_column("products", sa.Column("updated_at", sa.DateTime(), nullable=True))
    op.execute(sa.text("UPDATE products SET stock_quantity = 0 WHERE stock_quantity IS NULL"))
    op.execute(sa.text("UPDATE products SET status = 'ACTIVE' WHERE status IS NULL"))
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute(sa.text("UPDATE products SET is_deleted = false WHERE is_deleted IS NULL"))
        op.execute(sa.text("UPDATE appointments SET is_deleted = false WHERE is_deleted IS NULL"))
    else:
        op.execute(sa.text("UPDATE products SET is_deleted = 0 WHERE is_deleted IS NULL"))
        op.execute(sa.text("UPDATE appointments SET is_deleted = 0 WHERE is_deleted IS NULL"))
    op.create_foreign_key(
        "fk_products_seller_id_sellers", "products", "sellers", ["seller_id"], ["id"]
    )
    op.create_foreign_key(
        "fk_products_category_id_categories",
        "products",
        "categories",
        ["category_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_products_category_id_categories", "products", type_="foreignkey")
    op.drop_constraint("fk_products_seller_id_sellers", "products", type_="foreignkey")
    op.drop_column("products", "updated_at")
    op.drop_column("products", "is_deleted")
    op.drop_column("products", "status")
    op.drop_column("products", "stock_quantity")
    op.drop_column("products", "category_id")
    op.drop_column("products", "seller_id")

    op.drop_constraint("fk_appointments_doctor_id_doctors", "appointments", type_="foreignkey")
    op.drop_constraint("fk_appointments_complaint_id_complaints", "appointments", type_="foreignkey")
    op.drop_constraint("uq_appointments_complaint_id", "appointments", type_="unique")
    op.drop_column("appointments", "is_deleted")
    op.drop_column("appointments", "updated_at")
    op.drop_column("appointments", "created_at")
    op.drop_column("appointments", "notes")
    op.drop_column("appointments", "doctor_id")
    op.drop_column("appointments", "complaint_id")

    op.drop_table("complaint_logs")
    op.drop_index(op.f("ix_complaints_id"), table_name="complaints")
    op.drop_table("complaints")
    op.drop_table("sellers")
    op.drop_table("categories")
