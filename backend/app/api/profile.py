from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.db import get_session

router = APIRouter()


class FavoriteIn(BaseModel):
    event_id: str
    title: str


@router.post("/favorites/add")
async def add_fav(payload: FavoriteIn, session=Depends(get_session)):
    # placeholder: store in DB
    return {"status": "added", "item": payload.dict()}
