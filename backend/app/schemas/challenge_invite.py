from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChallengeInviteResponse(BaseModel):
    """A challenge invite, enriched with just enough info to render a
    card without a follow-up lookup (challenge title, who sent it)."""

    id: int
    challenge_id: int
    challenge_title: str
    sender_id: int
    sender_name: str
    receiver_id: int
    receiver_name: str
    status: str
    created_at: datetime
    responded_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
