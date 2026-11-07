from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.store import store

router = APIRouter()


class UserIn(BaseModel):
    name: str
    role: str = "Staff"
    status: str = "Active"


class UserPatch(BaseModel):
    name: str | None = None
    role: str | None = None
    status: str | None = None


@router.get("")
def list_users(page: int = Query(1, ge=1), limit: int = Query(5, ge=1, le=50)):
    start = (page - 1) * limit
    return {
        "items": store.users[start : start + limit],
        "total": len(store.users),
        "page": page,
        "limit": limit,
    }


@router.post("", status_code=201)
def create_user(body: UserIn):
    next_id = max((u["id"] for u in store.users), default=0) + 1
    user = {
        "id": next_id,
        "name": body.name,
        "role": body.role,
        "status": body.status,
        "lastActive": "Just now",
    }
    store.users.append(user)
    return user


@router.patch("/{user_id}")
def patch_user(user_id: int, body: UserPatch):
    for user in store.users:
        if user["id"] == user_id:
            data = body.model_dump(exclude_unset=True)
            user.update(data)
            return user
    raise HTTPException(status_code=404, detail="User not found")


@router.delete("/{user_id}")
def delete_user(user_id: int):
    for i, user in enumerate(store.users):
        if user["id"] == user_id:
            store.users.pop(i)
            return {"ok": True}
    raise HTTPException(status_code=404, detail="User not found")
