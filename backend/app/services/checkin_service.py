from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.models.challenge import Challenge
from app.models.checkin import CheckIn
from app.models.user import User
from app.models.user_challenge import UserChallenge


def _get_active_checkin_enrollment(
    db: Session,
    user_id: int,
    challenge_id: int,
):
    result = (
        db.query(UserChallenge, Challenge)
        .join(Challenge, Challenge.id == UserChallenge.challenge_id)
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.challenge_id == challenge_id,
            UserChallenge.status == "ACTIVE",
        )
        .first()
    )

    if not result:
        raise ValueError("No active enrollment found for this challenge")

    user_challenge, challenge = result

    if challenge.type != "CHECKIN":
        raise ValueError(
            "This challenge isn't check-in based — it tracks progress "
            "automatically instead"
        )

    return user_challenge, challenge


def check_in(
    db: Session,
    user_id: int,
    challenge_id: int,
    note: str | None = None,
    photo_url: str | None = None,
):
    user_challenge, challenge = _get_active_checkin_enrollment(
        db,
        user_id=user_id,
        challenge_id=challenge_id,
    )

    today = date.today()

    already_checked_in = (
        db.query(CheckIn)
        .filter(
            CheckIn.user_challenge_id == user_challenge.id,
            CheckIn.checkin_date == today,
        )
        .first()
    )

    if already_checked_in:
        raise ValueError("You've already checked in today")

    checkin = CheckIn(
        user_challenge_id=user_challenge.id,
        checkin_date=today,
        note=note,
        photo_url=photo_url,
    )
    db.add(checkin)

    # Consecutive-day streak logic: continuing yesterday's streak
    # extends it, any gap resets to 1 (today counts as day one of a
    # fresh streak).
    if user_challenge.last_checkin_date == today - timedelta(days=1):
        user_challenge.current_streak += 1
    else:
        user_challenge.current_streak = 1

    user_challenge.last_checkin_date = today
    user_challenge.progress += 1
    user_challenge.longest_streak = max(
        user_challenge.longest_streak,
        user_challenge.current_streak,
    )

    challenge_completed = False

    if user_challenge.current_streak >= challenge.target:
        user_challenge.status = "COMPLETED"
        challenge_completed = True

        user = (
            db.query(User)
            .filter(User.id == user_id)
            .first()
        )

        if user:
            user.xp += challenge.xp_reward

    db.commit()
    db.refresh(user_challenge)

    return {
        "current_streak": user_challenge.current_streak,
        "longest_streak": user_challenge.longest_streak,
        "total_checkins": user_challenge.progress,
        "target_days": challenge.target,
        "challenge_completed": challenge_completed,
    }


def get_checkin_history(
    db: Session,
    user_id: int,
    challenge_id: int,
):
    """Returns check-in dates/notes for a calendar-style view."""
    user_challenge = (
        db.query(UserChallenge)
        .filter(
            UserChallenge.user_id == user_id,
            UserChallenge.challenge_id == challenge_id,
        )
        .first()
    )

    if not user_challenge:
        return []

    checkins = (
        db.query(CheckIn)
        .filter(CheckIn.user_challenge_id == user_challenge.id)
        .order_by(CheckIn.checkin_date.desc())
        .all()
    )

    return [
        {
            "date": c.checkin_date,
            "note": c.note,
            "photo_url": c.photo_url,
        }
        for c in checkins
    ]
