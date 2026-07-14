from sqlalchemy.orm import Session

from app.models.user import User
from app.services.friend_service import get_friends


def get_global_leaderboard(
    db: Session,
    current_user_id: int,
    limit: int = 50,
):
    users = (
        db.query(User)
        .order_by(User.xp.desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "rank": index + 1,
            "id": user.id,
            "name": user.name,
            "level": user.level,
            "xp": user.xp,
            "is_you": user.id == current_user_id,
        }
        for index, user in enumerate(users)
    ]


def get_friends_leaderboard(
    db: Session,
    current_user_id: int,
):
    """
    Ranks the current user against their accepted friends only.
    Reuses friend_service.get_friends() rather than re-querying the
    Friendship table, so this stays in sync with however "friends"
    is defined there.
    """
    friends = get_friends(db, current_user_id=current_user_id)

    me = (
        db.query(User)
        .filter(User.id == current_user_id)
        .first()
    )

    people = [
        {
            "id": friend["id"],
            "name": friend["name"],
            "level": friend["level"],
            "xp": friend["xp"],
        }
        for friend in friends
    ]

    if me:
        people.append(
            {
                "id": me.id,
                "name": me.name,
                "level": me.level,
                "xp": me.xp,
            }
        )

    people.sort(key=lambda person: person["xp"], reverse=True)

    return [
        {
            "rank": index + 1,
            **person,
            "is_you": person["id"] == current_user_id,
        }
        for index, person in enumerate(people)
    ]
