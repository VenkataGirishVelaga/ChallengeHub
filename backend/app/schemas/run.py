from datetime import datetime
from pydantic import BaseModel


class RunCreate(BaseModel):
    distance: float
    duration: int
    calories: int


class RunResponse(RunCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True