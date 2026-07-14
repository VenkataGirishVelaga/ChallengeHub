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
    checkin_only: bool = False,
):
    """
    A user can now have two active challenges at once — one
    DISTANCE-type (auto-tracked via runs) and one CHECKIN-type
    (manual daily tap) — so this filters by type rather than assuming
    a single active challenge. Anything not explicitly "CHECKIN" is
    treated as distance-based, so existing challenges created before
    this distinction existed keep working unchanged.
    """
    query = (
        db.query(Challenge)
        .join(
            UserChallenge,
            UserChallenge.challenge_id == Challenge.id,
        )
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.status == "ACTIVE",
        )
    )

    if checkin_only:
        query = query.filter(Challenge.type == "CHECKIN")
    else:
        query = query.filter(Challenge.type != "CHECKIN")

    return query.first()


def get_active_progress(
    db: Session,
    user_id: int,
    checkin_only: bool = False,
):
    """
    Returns progress details for the user's active challenge of the
    requested type. DISTANCE responses look like before (progress/
    target/percent in km). CHECKIN responses additionally include
    streak fields, with percent based on current_streak vs target.
    """
    query = (
        db.query(UserChallenge, Challenge)
        .join(Challenge, Challenge.id == UserChallenge.challenge_id)
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.status == "ACTIVE",
        )
    )

    if checkin_only:
        query = query.filter(Challenge.type == "CHECKIN")
    else:
        query = query.filter(Challenge.type != "CHECKIN")

    result = query.first()

    if not result:
        return None

    user_challenge, challenge = result

    if checkin_only:
        percent = 0
        if challenge.target:
            percent = min(
                100,
                round(
                    (user_challenge.current_streak / challenge.target) * 100
                ),
            )

        return {
            "challenge_id": challenge.id,
            "title": challenge.title,
            "current_streak": user_challenge.current_streak,
            "longest_streak": user_challenge.longest_streak,
            "total_checkins": user_challenge.progress,
            "target_days": challenge.target,
            "status": user_challenge.status,
            "percent": percent,
        }

    percent = 0
    if challenge.target:
        percent = min(
            100,
            round(
                (user_challenge.progress / challenge.target) * 100
            ),
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
    Applies run distance to the user's active DISTANCE-type challenge
    only — explicitly excludes CHECKIN-type challenges, which are
    never touched by saved runs (they only advance via check_in()).
    """
    result = (
        db.query(UserChallenge, Challenge)
        .join(Challenge, Challenge.id == UserChallenge.challenge_id)
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.status == "ACTIVE",
            Challenge.type != "CHECKIN",
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
