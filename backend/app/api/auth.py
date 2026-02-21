from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.core.security import create_access_token, get_current_user
from app.db import get_session
from app.models import User
from sqlmodel import select, or_
import re
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class RegisterIn(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str
    password: str = Field(..., min_length=8)

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginIn(BaseModel):
    username_or_email: str = Field(..., description="Username or email address")
    password: str

class UserOut(BaseModel):
    username: str
    email: str
    id: int

def is_email(text: str) -> bool:
    """Enterprise-grade email regex validation"""
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, text) is not None

@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterIn, session=Depends(get_session)):
    """
    User Registration: 
    - Enforces uniqueness on username/email
    - Uses Argon2id for secure password storage
    """
    q = await session.exec(
        select(User).where(
            or_(
                User.username == payload.username,
                User.email == payload.email
            )
        )
    )
    existing_user = q.first()
    if existing_user:
        logger.warning(f"Registration attempt failed: User already exists ({payload.username}/{payload.email})")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Identifier already registered."
        )
    
    try:
        user = User(username=payload.username, email=payload.email)
        user.set_password(payload.password)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        
        token = create_access_token({"uid": user.id, "sub": user.username})
        logger.info(f"New user registered: {user.username} (ID: {user.id})")
        return {"access_token": token}
    except Exception as e:
        logger.error(f"Registration failure: {e}")
        raise HTTPException(status_code=500, detail="Internal identity creation failed.")

@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, session=Depends(get_session)):
    """
    Authenticated Login:
    - Supports both username and email identification
    - Generates high-entropy JWT access tokens
    """
    try:
        if is_email(payload.username_or_email):
            q = await session.exec(select(User).where(User.email == payload.username_or_email))
        else:
            q = await session.exec(select(User).where(User.username == payload.username_or_email))
        
        user = q.first()
        if not user or not user.verify_password(payload.password):
            logger.warning(f"Login failure for: {payload.username_or_email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid credentials or key."
            )
        
        token = create_access_token({"uid": user.id, "sub": user.username})
        logger.info(f"User logged in: {user.username} (ID: {user.id})")
        return {"access_token": token}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login failure processing: {e}")
        raise HTTPException(status_code=500, detail="Identity verification failure.")

@router.get("/me", response_model=UserOut)
async def get_secure_profile(current=Depends(get_current_user)):
    """Retrieve authenticated user context"""
    return {
        "username": current.username, 
        "email": current.email,
        "id": current.id
    }
