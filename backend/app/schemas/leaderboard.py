from pydantic import BaseModel


class LeaderboardEntry(BaseModel):
    rank: int
    id: int
    name: str
    level: int
    xp: int
    is_you: bool = False
