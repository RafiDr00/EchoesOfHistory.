from fastapi import APIRouter

router = APIRouter()

from app.api import auth, search, chat, profile  # noqa: F401

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(search.router, prefix="/search", tags=["search"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(profile.router, prefix="/profile", tags=["profile"])
