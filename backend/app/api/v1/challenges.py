from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.dependencies import get_db
from app.models.challenge import Challenge
from app.models.user import User
from app.schemas.challenge import (
    ChallengeCreate,
    ChallengeResponse,
    ChallengeUpdate,
)
from app.schemas.challenge_invite import ChallengeInviteResponse
from app.services.challenge_invite_service import (
    accept_challenge_invite,
    decline_challenge_invite,
    get_challenge_rivals,
    get_received_invites,
    get_sent_invites,
    get_unseen_accepted_invites,
    mark_invite_seen,
    send_challenge_invite,
)
from app.services.challenge_service import (
    create_challenge,
    delete_challenge,
    get_challenges,
    update_challenge,
)
from app.services.user_challenge_service import (
    get_active_challenge,
    get_active_progress,
    get_all_active_challenges,
    join_challenge,
    leave_challenge,
)

router = APIRouter(
    prefix="/challenges",
    tags=["Challenges"],
)


@router.post(
    "",
    response_model=ChallengeResponse,
)
def create(
    challenge: ChallengeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db_challenge = Challenge(
        **challenge.model_dump(),
        created_by=current_user.id,
    )

    return create_challenge(
        db,
        db_challenge,
    )


@router.get(
    "",
    response_model=list[ChallengeResponse],
)
def get_all(
    db: Session = Depends(get_db),
):
    return get_challenges(db)


@router.patch(
    "/{challenge_id}",
    response_model=ChallengeResponse,
)
def edit(
    challenge_id: int,
    updates: ChallengeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Edit a challenge you created. Activity type and unit can't be
    changed here — see ChallengeUpdate for why."""
    try:
        return update_challenge(
            db,
            challenge_id=challenge_id,
            user_id=current_user.id,
            updates=updates.model_dump(exclude_unset=True),
        )
    except ValueError as error:
        raise HTTPException(status_code=403, detail=str(error))


@router.get("/active")
def active(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active RUNNING challenge (kept name for backward compatibility
    with the existing running screen)."""
    return get_active_challenge(
        db,
        user_id=current_user.id,
        activity_type="running",
    )


@router.get("/active/walking")
def active_walking(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active WALKING challenge, if any."""
    return get_active_challenge(
        db,
        user_id=current_user.id,
        activity_type="walking",
    )


@router.get("/active/checkin")
def active_checkin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active CHECKIN-type challenge, if any."""
    return get_active_challenge(
        db,
        user_id=current_user.id,
        checkin_only=True,
    )


@router.get("/active/all")
def active_all(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Every ACTIVE challenge the user has joined, distance and
    check-in alike — use this when a user may have joined more than
    one challenge, instead of /active + /active/checkin which each
    only ever surface a single one.
    """
    return get_all_active_challenges(
        db,
        user_id=current_user.id,
    )


@router.get("/progress")
def progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Progress for the active RUNNING challenge (kept name for
    backward compatibility with the existing running screen)."""
    return get_active_progress(
        db,
        user_id=current_user.id,
        activity_type="running",
    )


@router.get("/progress/walking")
def progress_walking(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Progress for the active WALKING challenge, if any."""
    return get_active_progress(
        db,
        user_id=current_user.id,
        activity_type="walking",
    )


@router.get("/progress/checkin")
def progress_checkin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Streak/progress for the active CHECKIN-type challenge, if any."""
    return get_active_progress(
        db,
        user_id=current_user.id,
        checkin_only=True,
    )


@router.post(
    "/{challenge_id}/invite/{friend_id}",
    response_model=ChallengeInviteResponse,
)
def invite_friend(
    challenge_id: int,
    friend_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Challenge a friend to join this challenge with you."""
    return send_challenge_invite(
        db,
        challenge_id=challenge_id,
        sender_id=current_user.id,
        receiver_id=friend_id,
    )


@router.get(
    "/invites",
    response_model=list[ChallengeInviteResponse],
)
def received_invites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Pending challenge invites from friends awaiting your response."""
    return get_received_invites(db, user_id=current_user.id)


@router.get(
    "/invites/sent",
    response_model=list[ChallengeInviteResponse],
)
def sent_invites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Challenge invites you've sent that are still pending."""
    return get_sent_invites(db, user_id=current_user.id)


@router.get(
    "/invites/accepted",
    response_model=list[ChallengeInviteResponse],
)
def accepted_invites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Invites you sent that a friend just accepted, not yet shown to you."""
    return get_unseen_accepted_invites(db, user_id=current_user.id)


@router.post("/invites/{invite_id}/seen")
def seen_invite(
    invite_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Dismiss the 'your friend accepted!' notification for this invite."""
    return mark_invite_seen(
        db,
        invite_id=invite_id,
        current_user_id=current_user.id,
    )


@router.post(
    "/invites/{invite_id}/accept",
    response_model=ChallengeInviteResponse,
)
def accept_invite(
    invite_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Accept a friend's challenge invite — joins you into the challenge."""
    return accept_challenge_invite(
        db,
        invite_id=invite_id,
        current_user_id=current_user.id,
    )


@router.post(
    "/invites/{invite_id}/decline",
    response_model=ChallengeInviteResponse,
)
def decline_invite(
    invite_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return decline_challenge_invite(
        db,
        invite_id=invite_id,
        current_user_id=current_user.id,
    )


@router.get("/{challenge_id}/rivals")
def rivals(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Head-to-head progress for this challenge: you plus anyone you're
    paired with through an accepted challenge invite, sorted by who's
    furthest along.
    """
    return get_challenge_rivals(
        db,
        challenge_id=challenge_id,
        user_id=current_user.id,
    )


@router.post("/{challenge_id}/join")
def join(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return join_challenge(
            db,
            user_id=current_user.id,
            challenge_id=challenge_id,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.delete("/{challenge_id}/leave")
def leave(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Leave a challenge you joined — doesn't affect other members."""
    try:
        leave_challenge(
            db,
            user_id=current_user.id,
            challenge_id=challenge_id,
        )

        return {"detail": "Left challenge"}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.delete("/{challenge_id}")
def delete(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a challenge you created — cascades to every member's enrollment."""
    try:
        delete_challenge(
            db,
            challenge_id=challenge_id,
            user_id=current_user.id,
        )

        return {"detail": "Challenge deleted"}
    except ValueError as error:
        raise HTTPException(status_code=403, detail=str(error))
