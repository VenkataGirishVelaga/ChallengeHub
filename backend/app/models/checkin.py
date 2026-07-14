from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class CheckIn(Base):
    __tablename__ = "checkins"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_challenge_id: Mapped[int] = mapped_column(
        ForeignKey("user_challenges.id"),
        nullable=False,
    )

    checkin_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    note: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    photo_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    __table_args__ = (
        # One check-in per user-challenge per calendar day.
        UniqueConstraint(
            "user_challenge_id",
            "checkin_date",
            name="uq_checkin_per_day",
        ),
    )
