from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.checkin import (
    CheckInCreate,
    CheckInHistoryEntry,
    CheckInResult,
)
from app.services.checkin_service import check_in, get_checkin_history

router = APIRouter(
    prefix="/challenges",
    tags=["Check-ins"],
)


@router.post(
    "/{challenge_id}/checkin",
    response_model=CheckInResult,
)
def create_checkin(
    challenge_id: int,
    data: CheckInCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return check_in(
            db,
            user_id=current_user.id,
            challenge_id=challenge_id,
            note=data.note,
            photo_url=data.photo_url,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get(
    "/{challenge_id}/checkins",
    response_model=list[CheckInHistoryEntry],
)
def checkin_history(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_checkin_history(
        db,
        user_id=current_user.id,
        challenge_id=challenge_id,
    )
