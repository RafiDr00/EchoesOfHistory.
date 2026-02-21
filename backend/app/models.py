from sqlmodel import SQLModel, Field, Session, select
from typing import Optional
from passlib.context import CryptContext
from datetime import datetime

pwd_ctx = CryptContext(schemes=["argon2"], deprecated="auto")


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str = ""

    def set_password(self, raw: str):
        self.hashed_password = pwd_ctx.hash(raw)

    def verify_password(self, raw: str) -> bool:
        return pwd_ctx.verify(raw, self.hashed_password)


class SearchHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, index=True)
    query: str
    source: str
    response: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
