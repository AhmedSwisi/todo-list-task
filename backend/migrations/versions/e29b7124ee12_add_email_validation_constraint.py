"""Add email validation constraint

Revision ID: e29b7124ee12
Revises: 91a910085870
Create Date: 2024-06-03 13:07:44.722108

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e29b7124ee12'
down_revision = '91a910085870'
branch_labels = None
depends_on = None


def upgrade():
    op.create_check_constraint(
        "valid_email",
        "user",
        "email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'"
    )


def downgrade():
    op.drop_constraint("valid_email", "user", type_='check')
