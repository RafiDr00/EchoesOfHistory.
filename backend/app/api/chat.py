from fastapi import APIRouter
from pydantic import BaseModel
from app.services.openai_client import generate_historical_chat

router = APIRouter()


class ChatIn(BaseModel):
    figure: str
    message: str


@router.post("/talk")
async def talk(payload: ChatIn):
    resp = await generate_historical_chat(payload.figure, payload.message)
    return {"reply": resp}
