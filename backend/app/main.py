from fastapi import FastAPI

from app.api.v1.auth import router as auth_router
from app.api.v1.badges import router as badges_router
from app.api.v1.challenges import router as challenge_router
from app.api.v1.checkins import router as checkins_router
from app.api.v1.friends import router as friends_router
from app.api.v1.users import router as user_router
from app.api.v1.runs import router as runs_router
from app.core.config import settings
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.include_router(auth_router)
app.include_router(badges_router)
app.include_router(challenge_router)
app.include_router(checkins_router)
app.include_router(friends_router)
app.include_router(user_router)
app.include_router(runs_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to ChallengeHub API 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }