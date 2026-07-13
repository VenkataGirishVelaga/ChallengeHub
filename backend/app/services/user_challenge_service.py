from sqlalchemy.orm import Session

from app.models.challenge import Challenge
from app.models.user import User
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


def get_active_progress(
    db: Session,
    user_id: int,
):
    """
    Returns progress details (progress/target/percent) for the
    user's current active challenge. Used to drive the home screen
    progress bar with real data instead of mock values.
    """
    result = (
        db.query(UserChallenge, Challenge)
        .join(Challenge, Challenge.id == UserChallenge.challenge_id)
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.status == "ACTIVE",
        )
        .first()
    )

    if not result:
        return None

    user_challenge, challenge = result

    percent = 0
    if challenge.target:
        percent = min(
            100,
            round((user_challenge.progress / challenge.target) * 100),
        )

    return {
        "challenge_id": challenge.id,
        "title": challenge.title,
        "progress": user_challenge.progress,
        "target": challenge.target,
        "unit": challenge.unit,
        "status": user_challenge.status,
        "percent": percent,
    }


def update_progress(
    db: Session,
    user_id: int,
    distance: float,
):
    """
    Applies run distance to the user's active challenge. If the
    challenge target is reached, the challenge is marked COMPLETED
    and the challenge's xp_reward is credited to the user.
    """
    result = (
        db.query(UserChallenge, Challenge)
        .join(Challenge, Challenge.id == UserChallenge.challenge_id)
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.status == "ACTIVE",
        )
        .first()
    )

    if not result:
        return None

    user_challenge, challenge = result

    user_challenge.progress += distance

    if user_challenge.progress >= challenge.target:
        user_challenge.progress = challenge.target
        user_challenge.status = "COMPLETED"

        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if user:
            user.xp += challenge.xp_reward

    db.commit()
    db.refresh(user_challenge)

    return user_challenge
