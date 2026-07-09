from fastapi import FastAPI

from app.api.v1.auth import router as auth_router
from app.core.config import settings
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.include_router(auth_router)


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