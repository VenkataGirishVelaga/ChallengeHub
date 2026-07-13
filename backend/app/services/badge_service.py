from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.run import Run
from app.models.user_badge import UserBadge

# Badge definitions are code-defined rather than a DB table — there's
# nothing admin-editable about them yet (that belongs with the Sprint 5
# admin dashboard), so a table + seed migration would be overhead with
# no payoff right now. UserBadge just records which codes a user earned.
#
# NOTE: Run.distance is stored in KILOMETERS. GPS tracking internally
# accumulates meters (mobile hooks/useRunTracker.ts via geolib), but
# app/running/summary.tsx converts to km (distance / 1000) before
# calling saveRun(), so that's what actually reaches this table.
BADGE_DEFINITIONS = [
    {
        "code": "first_run",
        "title": "First Steps",
        "description": "Complete your first run",
        "icon": "🏃",
    },
    {
        "code": "runs_5",
        "title": "Getting Started",
        "description": "Complete 5 runs",
        "icon": "🔥",
    },
    {
        "code": "runs_25",
        "title": "Committed",
        "description": "Complete 25 runs",
        "icon": "💪",
    },
    {
        "code": "distance_10k",
        "title": "10K Club",
        "description": "Run a total of 10km",
        "icon": "🎯",
    },
    {
        "code": "distance_50k",
        "title": "50K Club",
        "description": "Run a total of 50km",
        "icon": "🏅",
    },
    {
        "code": "distance_100k",
        "title": "Centurion",
        "description": "Run a total of 100km",
        "icon": "🏆",
    },
]


def get_user_badges(
    db: Session,
    user_id: int,
):
    earned = (
        db.query(UserBadge)
        .filter(UserBadge.user_id == user_id)
        .all()
    )

    earned_at_map = {badge.code: badge.earned_at for badge in earned}

    return [
        {
            **definition,
            "earned": definition["code"] in earned_at_map,
            "earned_at": earned_at_map.get(definition["code"]),
        }
        for definition in BADGE_DEFINITIONS
    ]


def check_and_award_badges(
    db: Session,
    user_id: int,
):
    """
    Called after every saved run. Compares the user's run count and
    total distance against BADGE_DEFINITIONS thresholds and awards
    any newly-earned badges. Returns the list of newly awarded codes
    so the frontend can surface a "badge unlocked" moment.
    """
    run_count = (
        db.query(func.count(Run.id))
        .filter(Run.user_id == user_id)
        .scalar()
    ) or 0

    total_distance = (
        db.query(func.coalesce(func.sum(Run.distance), 0))
        .filter(Run.user_id == user_id)
        .scalar()
    ) or 0

    already_earned = {
        badge.code
        for badge in db.query(UserBadge)
        .filter(UserBadge.user_id == user_id)
        .all()
    }

    qualifies = {
        "first_run": run_count >= 1,
        "runs_5": run_count >= 5,
        "runs_25": run_count >= 25,
        "distance_10k": total_distance >= 10,
        "distance_50k": total_distance >= 50,
        "distance_100k": total_distance >= 100,
    }

    newly_awarded = []

    for code, met in qualifies.items():
        if met and code not in already_earned:
            db.add(UserBadge(user_id=user_id, code=code))
            newly_awarded.append(code)

    if newly_awarded:
        db.commit()

    return newly_awarded
