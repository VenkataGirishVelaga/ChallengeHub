from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.dependencies import get_db
from app.models.run import Run
from app.models.user import User
from app.schemas.run import RunCreate, RunResponse, RunSaveResponse, RunStats
from app.services.badge_service import check_and_award_badges
from app.services.run_service import create_run, get_user_runs, get_user_stats
from app.services.user_challenge_service import update_progress

router = APIRouter(
    prefix="/runs",
    tags=["Runs"],
)


@router.post(
    "",
    response_model=RunSaveResponse,
)
def save_run(
    data: RunCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    run = Run(
        user_id=current_user.id,
        distance=data.distance,
        duration=data.duration,
        calories=data.calories,
        activity_type=data.activity_type,
    )

    run = create_run(db, run)

    updated_challenge = update_progress(
        db,
        user_id=current_user.id,
        distance=data.distance,
        activity_type=data.activity_type,
    )

    challenge_completed = (
        updated_challenge is not None
        and updated_challenge.status == "COMPLETED"
    )

    new_badges = check_and_award_badges(
        db,
        user_id=current_user.id,
    )

    return RunSaveResponse(
        id=run.id,
        user_id=run.user_id,
        distance=run.distance,
        duration=run.duration,
        calories=run.calories,
        activity_type=run.activity_type,
        created_at=run.created_at,
        challenge_completed=challenge_completed,
        new_badges=new_badges,
    )


@router.get(
    "",
    response_model=list[RunResponse],
)
def history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_runs(
        db,
        user_id=current_user.id,
    )


@router.get(
    "/stats",
    response_model=RunStats,
)
def stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_stats(
        db,
        user_id=current_user.id,
    )
