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