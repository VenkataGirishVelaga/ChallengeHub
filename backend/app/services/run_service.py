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
    Aggregate stats for the profile/analytics screen. Run.distance is
    stored in KILOMETERS (see badge_service.py note), duration in
    seconds, so pace here matches the mobile pace calculator's units.
    """
    total_runs, total_distance, total_duration, total_calories = (
        db.query(
            func.count(Run.id),
            func.coalesce(func.sum(Run.distance), 0),
            func.coalesce(func.sum(Run.duration), 0),
            func.coalesce(func.sum(Run.calories), 0),
        )
        .filter(Run.user_id == user_id)
        .first()
    )

    avg_pace_seconds_per_km = None

    if total_distance and total_distance > 0:
        avg_pace_seconds_per_km = total_duration / total_distance

    return {
        "total_runs": total_runs,
        "total_distance": total_distance,
        "total_duration": total_duration,
        "total_calories": total_calories,
        "avg_pace_seconds_per_km": avg_pace_seconds_per_km,
    }
