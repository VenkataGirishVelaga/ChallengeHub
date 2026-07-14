from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserSearchResult(BaseModel):
    id: int
    name: str
    email: str
    level: int
    xp: int

    model_config = ConfigDict(from_attributes=True)


class FriendshipResponse(BaseModel):
    id: int
    requester_id: int
    addressee_id: int
    status: str
    created_at: datetime
    responded_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class FriendResponse(BaseModel):
    """A friend as seen from the current user's perspective."""

    friendship_id: int
    id: int
    name: str
    email: str
    level: int
    xp: int
    since: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class PendingRequestResponse(BaseModel):
    """An incoming friend request awaiting a response."""

    friendship_id: int
    id: int
    name: str
    email: str
    level: int
    requested_at: datetime

    model_config = ConfigDict(from_attributes=True)
