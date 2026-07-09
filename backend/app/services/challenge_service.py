from sqlalchemy.orm import Session

from app.models.challenge import Challenge


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