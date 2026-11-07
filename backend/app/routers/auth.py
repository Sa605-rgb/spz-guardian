import secrets

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.config import settings
from app.data.catalog import DEMO_USER, FACILITY
from app.deps import get_current_user
from app.store import store

router = APIRouter()


class LoginIn(BaseModel):
    email: str
    password: str = Field(min_length=4)


@router.post("/login")
def login(body: LoginIn):
    if body.email.lower() != settings.demo_email.lower() or body.password != settings.demo_password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = secrets.token_urlsafe(32)
    user = {**DEMO_USER, "email": settings.demo_email}
    store.tokens[token] = user
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/logout")
def logout(user: dict = Depends(get_current_user)):
    for token, stored in list(store.tokens.items()):
        if stored.get("id") == user.get("id"):
            store.tokens.pop(token, None)
    return {"ok": True}


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return user


facility_router = APIRouter()


@facility_router.get("/current")
def current_facility():
    return FACILITY
