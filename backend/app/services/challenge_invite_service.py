from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models.challenge import Challenge
from app.models.challenge_invite import ChallengeInvite
from app.models.friendship import Friendship
from app.models.user import User
from app.models.user_challenge import UserChallenge
from app.services.user_challenge_service import join_challenge


def _are_friends(db: Session, user_a: int, user_b: int) -> bool:
    friendship = (
        db.query(Friendship)
        .filter(
            Friendship.status == "ACCEPTED",
            or_(
                and_(
                    Friendship.requester_id == user_a,
                    Friendship.addressee_id == user_b,
                ),
                and_(
                    Friendship.requester_id == user_b,
                    Friendship.addressee_id == user_a,
                ),
            ),
        )
        .first()
    )

    return friendship is not None


def get_challenge_rivals(db: Session, challenge_id: int, user_id: int):
    """
    Head-to-head view for a challenge: you, plus anyone you've either
    challenged or been challenged by (an ACCEPTED invite in either
    direction) for this specific challenge — each with their current
    progress, sorted so whoever's furthest along is first.

    Only ACCEPTED invites count as a "rivalry" — a pending or
    declined invite isn't a rivalry yet/anymore.
    """
    challenge = (
        db.query(Challenge)
        .filter(Challenge.id == challenge_id)
        .first()
    )

    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found.",
        )

    accepted_invites = (
        db.query(ChallengeInvite)
        .filter(
            ChallengeInvite.challenge_id == challenge_id,
            ChallengeInvite.status == "ACCEPTED",
            or_(
                ChallengeInvite.sender_id == user_id,
                ChallengeInvite.receiver_id == user_id,
            ),
        )
        .all()
    )

    rival_ids = {
        invite.receiver_id if invite.sender_id == user_id else invite.sender_id
        for invite in accepted_invites
    }

    # Always include yourself, even with no rivals yet, so the
    # frontend can show "just you, no rivals" instead of nothing.
    all_ids = {user_id, *rival_ids}

    rows = (
        db.query(UserChallenge, User)
        .join(User, User.id == UserChallenge.user_id)
        .filter(
            UserChallenge.challenge_id == challenge_id,
            UserChallenge.user_id.in_(all_ids),
        )
        .all()
    )

    entries = []

    for user_challenge, user in rows:
        percent = 0
        if challenge.target:
            percent = min(
                100,
                round((user_challenge.progress / challenge.target) * 100),
            )

        entries.append(
            {
                "user_id": user.id,
                "name": user.name,
                "progress": user_challenge.progress,
                "percent": percent,
                "status": user_challenge.status,
                "is_you": user.id == user_id,
            }
        )

    entries.sort(key=lambda entry: entry["progress"], reverse=True)

    return {
        "challenge_id": challenge.id,
        "title": challenge.title,
        "target": challenge.target,
        "unit": challenge.unit,
        "entries": entries,
    }


def send_challenge_invite(
    db: Session,
    challenge_id: int,
    sender_id: int,
    receiver_id: int,
):
    if sender_id == receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can't challenge yourself.",
        )

    challenge = (
        db.query(Challenge)
        .filter(Challenge.id == challenge_id)
        .first()
    )

    if not challenge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge not found.",
        )

    receiver = (
        db.query(User)
        .filter(User.id == receiver_id)
        .first()
    )

    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    if not _are_friends(db, sender_id, receiver_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can only challenge a friend.",
        )

    already_joined = (
        db.query(UserChallenge)
        .filter(
            UserChallenge.user_id == receiver_id,
            UserChallenge.challenge_id == challenge_id,
        )
        .first()
    )

    if already_joined:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This friend has already joined that challenge.",
        )

    existing = (
        db.query(ChallengeInvite)
        .filter(
            ChallengeInvite.challenge_id == challenge_id,
            ChallengeInvite.receiver_id == receiver_id,
        )
        .first()
    )

    if existing:
        if existing.status == "PENDING":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You've already challenged this friend to this one.",
            )

        # A previous DECLINED/ACCEPTED invite exists — reuse the row
        # for the fresh challenge instead of hitting the unique
        # constraint on (challenge_id, receiver_id).
        existing.sender_id = sender_id
        existing.status = "PENDING"
        existing.created_at = datetime.utcnow()
        existing.responded_at = None
        existing.seen_by_sender = False

        db.commit()
        db.refresh(existing)

        return _to_response(db, existing)

    invite = ChallengeInvite(
        challenge_id=challenge_id,
        sender_id=sender_id,
        receiver_id=receiver_id,
        status="PENDING",
    )

    db.add(invite)
    db.commit()
    db.refresh(invite)

    return _to_response(db, invite)


def _to_response(db: Session, invite: ChallengeInvite):
    challenge = (
        db.query(Challenge)
        .filter(Challenge.id == invite.challenge_id)
        .first()
    )
    sender = (
        db.query(User)
        .filter(User.id == invite.sender_id)
        .first()
    )
    receiver = (
        db.query(User)
        .filter(User.id == invite.receiver_id)
        .first()
    )

    return {
        "id": invite.id,
        "challenge_id": invite.challenge_id,
        "challenge_title": challenge.title if challenge else "",
        "sender_id": invite.sender_id,
        "sender_name": sender.name if sender else "",
        "receiver_id": invite.receiver_id,
        "receiver_name": receiver.name if receiver else "",
        "status": invite.status,
        "created_at": invite.created_at,
        "responded_at": invite.responded_at,
    }


def get_received_invites(db: Session, user_id: int):
    """Pending challenge invites this user still needs to respond to."""
    rows = (
        db.query(ChallengeInvite)
        .filter(
            ChallengeInvite.receiver_id == user_id,
            ChallengeInvite.status == "PENDING",
        )
        .order_by(ChallengeInvite.created_at.desc())
        .all()
    )

    return [_to_response(db, row) for row in rows]


def get_sent_invites(db: Session, user_id: int):
    """Invites this user sent that are still awaiting a response."""
    rows = (
        db.query(ChallengeInvite)
        .filter(
            ChallengeInvite.sender_id == user_id,
            ChallengeInvite.status == "PENDING",
        )
        .order_by(ChallengeInvite.created_at.desc())
        .all()
    )

    return [_to_response(db, row) for row in rows]


def _get_owned_pending_invite(db: Session, invite_id: int, current_user_id: int):
    invite = (
        db.query(ChallengeInvite)
        .filter(ChallengeInvite.id == invite_id)
        .first()
    )

    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge invite not found.",
        )

    if invite.receiver_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can't respond to this invite.",
        )

    if invite.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This invite has already been responded to.",
        )

    return invite


def accept_challenge_invite(db: Session, invite_id: int, current_user_id: int):
    invite = _get_owned_pending_invite(db, invite_id, current_user_id)

    invite.status = "ACCEPTED"
    invite.responded_at = datetime.utcnow()

    already_joined = (
        db.query(UserChallenge)
        .filter(
            UserChallenge.user_id == current_user_id,
            UserChallenge.challenge_id == invite.challenge_id,
        )
        .first()
    )

    if not already_joined:
        join_challenge(
            db,
            user_id=current_user_id,
            challenge_id=invite.challenge_id,
        )

    db.commit()
    db.refresh(invite)

    return _to_response(db, invite)


def decline_challenge_invite(db: Session, invite_id: int, current_user_id: int):
    invite = _get_owned_pending_invite(db, invite_id, current_user_id)

    invite.status = "DECLINED"
    invite.responded_at = datetime.utcnow()

    db.commit()
    db.refresh(invite)

    return _to_response(db, invite)


def get_unseen_accepted_invites(db: Session, user_id: int):
    """
    Invites this user SENT that a friend has since accepted, which
    they haven't been shown yet — the "your friend accepted!" moment.
    Call mark_invite_seen once it's been shown so it doesn't repeat.
    """
    rows = (
        db.query(ChallengeInvite)
        .filter(
            ChallengeInvite.sender_id == user_id,
            ChallengeInvite.status == "ACCEPTED",
            ChallengeInvite.seen_by_sender == False,  # noqa: E712
        )
        .order_by(ChallengeInvite.responded_at.desc())
        .all()
    )

    return [_to_response(db, row) for row in rows]


def mark_invite_seen(db: Session, invite_id: int, current_user_id: int):
    invite = (
        db.query(ChallengeInvite)
        .filter(ChallengeInvite.id == invite_id)
        .first()
    )

    if not invite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Challenge invite not found.",
        )

    if invite.sender_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can't dismiss this invite.",
        )

    invite.seen_by_sender = True
    db.commit()

    return {"detail": "Marked as seen"}
