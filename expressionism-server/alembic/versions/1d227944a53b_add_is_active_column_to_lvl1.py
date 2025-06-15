"""Add is_active column to lvl1

Revision ID: 1d227944a53b
Revises: dace349f07b0
Create Date: 2025-06-15 16:15:52.954917

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1d227944a53b'
down_revision: Union[str, None] = 'dace349f07b0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
