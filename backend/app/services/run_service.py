from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.run import Run


def create_run(
    db: Session,
    run: Run,
):
    db.add(run)
    db.commit()
    db.refresh(run)

    return run


def get_user_runs(
    db: Session,
    user_id: int,
    limit: int = 50,
):
    return (
        db.query(Run)
        .filter(Run.user_id == user_id)
        .order_by(Run.created_at.desc())
        .limit(limit)
        .all()
    )


def get_user_stats(
    db: Session,
    user_id: int,
):
    """
    Aggregate stats for the profile/analytics screen. Only "running"
    activity_type rows count toward total_distance/pace — running's
    distance is in km, but walking's distance column actually holds a
    step count (see badge_service.py), so mixing them here would
    silently corrupt both the distance total and the pace math.
    Walking gets its own separate total_steps figure instead.
    """
    total_runs, total_distance, running_duration, total_calories = (
        db.query(
            func.count(Run.id),
            func.coalesce(func.sum(Run.distance), 0),
            func.coalesce(func.sum(Run.duration), 0),
            func.coalesce(func.sum(Run.calories), 0),
        )
        .filter(
            Run.user_id == user_id,
            Run.activity_type == "running",
        )
        .first()
    )

    total_steps = (
        db.query(func.coalesce(func.sum(Run.distance), 0))
        .filter(
            Run.user_id == user_id,
            Run.activity_type == "walking",
        )
        .scalar()
    ) or 0

    avg_pace_seconds_per_km = None

    if total_distance and total_distance > 0:
        avg_pace_seconds_per_km = running_duration / total_distance

    return {
        "total_runs": total_runs,
        "total_distance": total_distance,
        "total_duration": running_duration,
        "total_calories": total_calories,
        "avg_pace_seconds_per_km": avg_pace_seconds_per_km,
        "total_steps": total_steps,
    }
