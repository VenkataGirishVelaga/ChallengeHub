from sqlalchemy.orm import Session

from app.models.challenge import Challenge
from app.models.checkin import CheckIn
from app.models.user_challenge import UserChallenge


def create_challenge(
    db: Session,
    challenge: Challenge,
):
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


def get_challenges(db: Session):
    return db.query(Challenge).all()


def get_challenge(
    db: Session,
    challenge_id: int,
):
    return (
        db.query(Challenge)
        .filter(Challenge.id == challenge_id)
        .first()
    )


def delete_challenge(
    db: Session,
    challenge_id: int,
    user_id: int,
):
    """
    Only the creator can delete a challenge. This cascades: every
    enrollment (UserChallenge) tied to it — across ALL users who
    joined it, not just the creator — is removed, along with any
    check-ins logged against those enrollments.
    """
    challenge = (
        db.query(Challenge)
        .filter(Challenge.id == challenge_id)
        .first()
    )

    if not challenge:
        raise ValueError("Challenge not found")

    if challenge.created_by != user_id:
        raise ValueError("Only the creator can delete this challenge")

    user_challenge_ids = [
        row.id
        for row in db.query(UserChallenge)
        .filter(UserChallenge.challenge_id == challenge_id)
        .all()
    ]

    if user_challenge_ids:
        db.query(CheckIn).filter(
            CheckIn.user_challenge_id.in_(user_challenge_ids)
        ).delete(synchronize_session=False)

        db.query(UserChallenge).filter(
            UserChallenge.challenge_id == challenge_id
        ).delete(synchronize_session=False)

    db.delete(challenge)
    db.commit()

    return True
