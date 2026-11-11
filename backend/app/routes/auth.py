from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from jose import jwt
from pydantic import BaseModel
from datetime import datetime, timedelta

from app.db.database import get_db
from app.models.user import User
from app.core.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])


def create_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        email=data.email,
        password_hash=bcrypt.hash(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User created successfully"}


@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not bcrypt.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"sub": str(user.id), "email": user.email})
    return {"access_token": token}


@router.get("/profile")
def profile(authorization: str | None = Header(default=None), db: Session = Depends(get_db)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        token = authorization.replace("Bearer ", "")
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user = db.query(User).filter(User.email == payload.get("email")).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {"email": user.email, "id": str(user.id)}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")