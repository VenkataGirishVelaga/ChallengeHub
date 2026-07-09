from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.challenge import Challenge
from app.schemas.challenge import (
    ChallengeCreate,
    ChallengeResponse,
)
from app.services.challenge_service import (
    create_challenge,
    get_challenges,
)
from app.services.user_challenge_service import join_challenge

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
):
    db_challenge = Challenge(
        **challenge.model_dump(),
        created_by=1,
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


@router.post("/{challenge_id}/join")
def join(
    challenge_id: int,
    db: Session = Depends(get_db),
):
    return join_challenge(
        db,
        user_id=1,
        challenge_id=challenge_id,
    )