from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.dependencies import get_db
from app.models.user import User
from app.services.badge_service import get_user_badges

router = APIRouter(
    prefix="/badges",
    tags=["Badges"],
)


@router.get("/me")
def my_badges(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_badges(
        db,
        user_id=current_user.id,
    )
