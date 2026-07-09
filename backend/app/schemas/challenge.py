from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChallengeCreate(BaseModel):
    title: str
    description: str
    type: str
    target: int
    unit: str
    difficulty: str = "easy"
    xp_reward: int = 100
    is_public: bool = True


class ChallengeResponse(BaseModel):
    id: int
    title: str
    description: str
    type: str
    target: int
    unit: str
    difficulty: str
    xp_reward: int
    is_public: bool
    created_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)