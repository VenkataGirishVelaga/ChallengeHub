"""add checkins table and streak fields

Revision ID: e4f5a6b7c8d9
Revises: a1b2c3d4e5f6
Create Date: 2026-07-14 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4f5a6b7c8d9'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        'user_challenges',
        sa.Column('current_streak', sa.Integer(), nullable=False, server_default='0'),
    )
    op.add_column(
        'user_challenges',
        sa.Column('longest_streak', sa.Integer(), nullable=False, server_default='0'),
    )
    op.add_column(
        'user_challenges',
        sa.Column('last_checkin_date', sa.Date(), nullable=True),
    )

    op.create_table(
        'checkins',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_challenge_id', sa.Integer(), nullable=False),
        sa.Column('checkin_date', sa.Date(), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('photo_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_challenge_id'], ['user_challenges.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_challenge_id', 'checkin_date', name='uq_checkin_per_day'),
    )
    op.create_index(op.f('ix_checkins_id'), 'checkins', ['id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_checkins_id'), table_name='checkins')
    op.drop_table('checkins')
    op.drop_column('user_challenges', 'last_checkin_date')
    op.drop_column('user_challenges', 'longest_streak')
    op.drop_column('user_challenges', 'current_streak')
