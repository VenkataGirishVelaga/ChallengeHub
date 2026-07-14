from datetime import date

from pydantic import BaseModel


class CheckInCreate(BaseModel):
    note: str | None = None
    photo_url: str | None = None


class CheckInResult(BaseModel):
    current_streak: int
    longest_streak: int
    total_checkins: float
    target_days: int
    challenge_completed: bool


class CheckInHistoryEntry(BaseModel):
    date: date
    note: str | None = None
    photo_url: str | None = None
