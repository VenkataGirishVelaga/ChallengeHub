from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models.friendship import Friendship
from app.models.user import User


def search_users(
    db: Session,
    current_user_id: int,
    query: str,
    limit: int = 20,
):
    """
    Search users by name or email, excluding the current user. Used to
    find people to send friend requests to.
    """
    like_pattern = f"%{query}%"

    return (
        db.query(User)
        .filter(
            User.id != current_user_id,
            or_(
                User.name.ilike(like_pattern),
                User.email.ilike(like_pattern),
            ),
        )
        .limit(limit)
        .all()
    )


def _get_pair(db: Session, user_a: int, user_b: int):
    """
    A friendship row can exist in either direction (a->b or b->a), so
    every lookup by "the pair of these two users" needs to check both.
    """
    return (
        db.query(Friendship)
        .filter(
            or_(
                and_(
                    Friendship.requester_id == user_a,
                    Friendship.addressee_id == user_b,
                ),
                and_(
                    Friendship.requester_id == user_b,
                    Friendship.addressee_id == user_a,
                ),
            )
        )
        .first()
    )


def send_friend_request(
    db: Session,
    requester_id: int,
    addressee_id: int,
):
    if requester_id == addressee_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can't send a friend request to yourself.",
        )

    addressee = (
        db.query(User)
        .filter(User.id == addressee_id)
        .first()
    )

    if not addressee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    existing = _get_pair(db, requester_id, addressee_id)

    if existing:
        if existing.status == "ACCEPTED":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You're already friends with this user.",
            )
        if existing.status == "PENDING":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A friend request is already pending between you two.",
            )
        # A previous REJECTED request exists — let a fresh one through
        # by reusing the row instead of hitting the unique constraint.
        existing.requester_id = requester_id
        existing.addressee_id = addressee_id
        existing.status = "PENDING"
        existing.created_at = datetime.utcnow()
        existing.responded_at = None

        db.commit()
        db.refresh(existing)

        return existing

    friendship = Friendship(
        requester_id=requester_id,
        addressee_id=addressee_id,
        status="PENDING",
    )

    db.add(friendship)
    db.commit()
    db.refresh(friendship)

    return friendship


def _get_owned_pending_request(db: Session, friendship_id: int, current_user_id: int):
    """
    Fetches a PENDING request and confirms the current user is the
    addressee — only the recipient of a request can accept/reject it.
    """
    friendship = (
        db.query(Friendship)
        .filter(Friendship.id == friendship_id)
        .first()
    )

    if not friendship:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Friend request not found.",
        )

    if friendship.addressee_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can't respond to this request.",
        )

    if friendship.status != "PENDING":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This request has already been responded to.",
        )

    return friendship


def accept_friend_request(db: Session, friendship_id: int, current_user_id: int):
    friendship = _get_owned_pending_request(db, friendship_id, current_user_id)

    friendship.status = "ACCEPTED"
    friendship.responded_at = datetime.utcnow()

    db.commit()
    db.refresh(friendship)

    return friendship


def reject_friend_request(db: Session, friendship_id: int, current_user_id: int):
    friendship = _get_owned_pending_request(db, friendship_id, current_user_id)

    friendship.status = "REJECTED"
    friendship.responded_at = datetime.utcnow()

    db.commit()
    db.refresh(friendship)

    return friendship


def remove_friend(db: Session, current_user_id: int, friend_id: int):
    friendship = _get_pair(db, current_user_id, friend_id)

    if not friendship or friendship.status != "ACCEPTED":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You're not friends with this user.",
        )

    db.delete(friendship)
    db.commit()

    return {"detail": "Friend removed."}


def get_friends(db: Session, current_user_id: int):
    """
    Returns accepted friends with the friendship rows joined to the
    *other* user's profile, regardless of who originally sent the
    request.
    """
    rows = (
        db.query(Friendship)
        .filter(
            Friendship.status == "ACCEPTED",
            or_(
                Friendship.requester_id == current_user_id,
                Friendship.addressee_id == current_user_id,
            ),
        )
        .all()
    )

    results = []

    for row in rows:
        other_id = (
            row.addressee_id
            if row.requester_id == current_user_id
            else row.requester_id
        )

        other_user = (
            db.query(User)
            .filter(User.id == other_id)
            .first()
        )

        if not other_user:
            continue

        results.append(
            {
                "friendship_id": row.id,
                "id": other_user.id,
                "name": other_user.name,
                "email": other_user.email,
                "level": other_user.level,
                "xp": other_user.xp,
                "since": row.responded_at,
            }
        )

    return results


def get_pending_requests(db: Session, current_user_id: int):
    """Incoming requests only — ones this user needs to act on."""
    rows = (
        db.query(Friendship)
        .filter(
            Friendship.addressee_id == current_user_id,
            Friendship.status == "PENDING",
        )
        .all()
    )

    results = []

    for row in rows:
        requester = (
            db.query(User)
            .filter(User.id == row.requester_id)
            .first()
        )

        if not requester:
            continue

        results.append(
            {
                "friendship_id": row.id,
                "id": requester.id,
                "name": requester.name,
                "email": requester.email,
                "level": requester.level,
                "requested_at": row.created_at,
            }
        )

    return results
