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


class ChallengeUpdate(BaseModel):
    """
    Deliberately excludes `type` and `unit` — once a challenge has
    members tracking progress against it, changing the activity or
    unit of measurement would silently corrupt everyone's existing
    progress numbers (e.g. km vs steps). Title/description/target and
    the reward fields are safe to change any time.
    """
    title: str | None = None
    description: str | None = None
    target: int | None = None
    difficulty: str | None = None
    xp_reward: int | None = None
    is_public: bool | None = None


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