from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.friend import (
    FriendResponse,
    FriendshipResponse,
    PendingRequestResponse,
    UserSearchResult,
)
from app.services.friend_service import (
    accept_friend_request,
    get_friends,
    get_pending_requests,
    reject_friend_request,
    remove_friend,
    search_users,
    send_friend_request,
)

router = APIRouter(
    prefix="/friends",
    tags=["Friends"],
)


@router.get(
    "/search",
    response_model=list[UserSearchResult],
)
def search(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return search_users(
        db,
        current_user_id=current_user.id,
        query=q,
    )


@router.get(
    "",
    response_model=list[FriendResponse],
)
def list_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_friends(db, current_user_id=current_user.id)


@router.get(
    "/pending",
    response_model=list[PendingRequestResponse],
)
def pending(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_pending_requests(db, current_user_id=current_user.id)


@router.post(
    "/request/{user_id}",
    response_model=FriendshipResponse,
)
def request_friend(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return send_friend_request(
        db,
        requester_id=current_user.id,
        addressee_id=user_id,
    )


@router.post(
    "/{friendship_id}/accept",
    response_model=FriendshipResponse,
)
def accept(
    friendship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return accept_friend_request(
        db,
        friendship_id=friendship_id,
        current_user_id=current_user.id,
    )


@router.post(
    "/{friendship_id}/reject",
    response_model=FriendshipResponse,
)
def reject(
    friendship_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return reject_friend_request(
        db,
        friendship_id=friendship_id,
        current_user_id=current_user.id,
    )


@router.delete("/{friend_id}")
def unfriend(
    friend_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return remove_friend(
        db,
        current_user_id=current_user.id,
        friend_id=friend_id,
    )
