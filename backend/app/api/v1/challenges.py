from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.dependencies import get_db
from app.models.challenge import Challenge
from app.models.user import User
from app.schemas.challenge import (
    ChallengeCreate,
    ChallengeResponse,
)
from app.services.challenge_service import (
    create_challenge,
    get_challenges,
)
from app.services.user_challenge_service import (
    get_active_challenge,
    get_active_progress,
    join_challenge,
)

router = APIRouter(
    prefix="/challenges",
    tags=["Challenges"],
)


@router.post(
    "",
    response_model=ChallengeResponse,
)
def create(
    challenge: ChallengeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_challenge = Challenge(
        **challenge.model_dump(),
        created_by=current_user.id,
    )

    return create_challenge(
        db,
        db_challenge,
    )


@router.get(
    "",
    response_model=list[ChallengeResponse],
)
def get_all(
    db: Session = Depends(get_db),
):
    return get_challenges(db)


@router.get("/active")
def active(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active DISTANCE-type challenge (unchanged behavior)."""
    return get_active_challenge(
        db,
        user_id=current_user.id,
    )


@router.get("/active/checkin")
def active_checkin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active CHECKIN-type challenge, if any."""
    return get_active_challenge(
        db,
        user_id=current_user.id,
        checkin_only=True,
    )


@router.get("/progress")
def progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Progress for the active DISTANCE-type challenge (unchanged)."""
    return get_active_progress(
        db,
        user_id=current_user.id,
    )


@router.get("/progress/checkin")
def progress_checkin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Streak/progress for the active CHECKIN-type challenge, if any."""
    return get_active_progress(
        db,
        user_id=current_user.id,
        checkin_only=True,
    )


@router.post("/{challenge_id}/join")
def join(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return join_challenge(
        db,
        user_id=current_user.id,
        challenge_id=challenge_id,
    )
