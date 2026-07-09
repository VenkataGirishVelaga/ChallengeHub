from sqlalchemy.orm import Session

from app.models.challenge import Challenge
from app.models.user_challenge import UserChallenge


def join_challenge(
    db: Session,
    user_id: int,
    challenge_id: int,
):
    joined = UserChallenge(
        user_id=user_id,
        challenge_id=challenge_id,
    )

    db.add(joined)
    db.commit()
    db.refresh(joined)

    return joined


def get_active_challenge(
    db: Session,
    user_id: int,
):
    return (
        db.query(Challenge)
        .join(
            UserChallenge,
            UserChallenge.challenge_id == Challenge.id,
        )
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.status == "ACTIVE",
        )
        .first()
    )