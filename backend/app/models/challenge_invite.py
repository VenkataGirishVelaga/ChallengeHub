from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ChallengeInvite(Base):
    """
    A "challenge a friend" invite — one friend nudging another to join
    a specific challenge. Mirrors the Friendship request/response
    shape: PENDING -> ACCEPTED / DECLINED, with the row reused for a
    fresh invite after a decline rather than growing a new status.
    """

    __tablename__ = "challenge_invites"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    challenge_id: Mapped[int] = mapped_column(
        ForeignKey("challenges.id"),
        nullable=False,
    )

    # The friend who sent the challenge invite.
    sender_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    # The friend being challenged.
    receiver_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    # PENDING -> ACCEPTED / DECLINED.
    status: Mapped[str] = mapped_column(
        String(20),
        default="PENDING",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    responded_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    # Lets the sender get a one-time "your friend accepted!" moment
    # instead of the invite just silently vanishing from their sent
    # list. Only meaningful once status == ACCEPTED; irrelevant
    # otherwise.
    seen_by_sender: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    __table_args__ = (
        # One invite row per (challenge, receiver) — re-inviting after
        # a decline reuses the row instead of stacking duplicates.
        UniqueConstraint(
            "challenge_id",
            "receiver_id",
            name="uq_challenge_invite_pair",
        ),
    )
