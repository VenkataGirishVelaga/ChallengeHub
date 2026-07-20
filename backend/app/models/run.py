from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.sql import func

from app.database.base import Base


class Run(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    distance = Column(Float, nullable=False)
    duration = Column(Integer, nullable=False)
    calories = Column(Integer, nullable=False)

    # "running" (GPS distance in km) or "walking" (step count, stored
    # in `distance` as a raw step total — see badge_service.py note
    # on units before touching this field elsewhere).
    activity_type = Column(
        String(20),
        nullable=False,
        default="running",
        server_default="running",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
