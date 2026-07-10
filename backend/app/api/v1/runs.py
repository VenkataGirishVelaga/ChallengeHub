from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.models.run import Run
from app.schemas.run import RunCreate, RunResponse
from app.services.run_service import create_run

router = APIRouter(
    prefix="/runs",
    tags=["Runs"],
)


@router.post(
    "",
    response_model=RunResponse,
)
def save_run(
    data: RunCreate,
    db: Session = Depends(get_db),
):
    print("REQUEST:", data.model_dump())

    run = Run(
        user_id=1,
        distance=data.distance,
        duration=data.duration,
        calories=data.calories,
    )

    return create_run(db, run)