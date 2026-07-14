from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class UserChallenge(Base):
    __tablename__ = "user_challenges"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    challenge_id: Mapped[int] = mapped_column(
        ForeignKey("challenges.id"),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="ACTIVE",
    )

    # For DISTANCE-type challenges: cumulative km. For CHECKIN-type
    # challenges: total number of check-ins logged (informational —
    # completion is driven by current_streak, not this field).
    progress: Mapped[float] = mapped_column(
        Float,
        default=0,
    )

    # CHECKIN-type only. Reset to 1 whenever a day is missed; a
    # challenge completes when current_streak reaches the challenge's
    # target (duration in days).
    current_streak: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    longest_streak: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    last_checkin_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    joined_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )
