"""add activity_type to runs

Revision ID: a7b8c9d0e1f2
Revises: f1a2b3c4d5e6
Create Date: 2026-07-16 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a7b8c9d0e1f2'
down_revision: Union[str, Sequence[str], None] = 'f1a2b3c4d5e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'runs',
        sa.Column(
            'activity_type',
            sa.String(length=20),
            nullable=False,
            server_default='running',
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('runs', 'activity_type')
