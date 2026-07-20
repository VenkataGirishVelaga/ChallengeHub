from datetime import datetime
from pydantic import BaseModel


class RunCreate(BaseModel):
    distance: float
    duration: int
    calories: int
    activity_type: str = "running"


class RunResponse(RunCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class RunSaveResponse(RunResponse):
    challenge_completed: bool = False
    new_badges: list[str] = []


class RunStats(BaseModel):
    total_runs: int
    total_distance: float
    total_duration: int
    total_calories: int
    avg_pace_seconds_per_km: float | None = None
    total_steps: float = 0
