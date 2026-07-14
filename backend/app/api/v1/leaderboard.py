from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.leaderboard import LeaderboardEntry
from app.services.leaderboard_service import (
    get_friends_leaderboard,
    get_global_leaderboard,
)

router = APIRouter(
    prefix="/leaderboard",
    tags=["Leaderboard"],
)


@router.get(
    "",
    response_model=list[LeaderboardEntry],
)
def global_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_global_leaderboard(
        db,
        current_user_id=current_user.id,
    )


@router.get(
    "/friends",
    response_model=list[LeaderboardEntry],
)
def friends_leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_friends_leaderboard(
        db,
        current_user_id=current_user.id,
    )
