from fastapi import APIRouter
from pydantic import BaseModel

from app.store import store

router = APIRouter()


class SettingsPatch(BaseModel):
    emailNotifications: bool | None = None
    darkMode: bool | None = None
    autoRefresh: bool | None = None
    auditLogging: bool | None = None
    hospital: str | None = None
    ward: str | None = None


@router.get("")
def get_settings():
    return store.settings


@router.patch("")
def patch_settings(body: SettingsPatch):
    data = body.model_dump(exclude_unset=True)
    store.settings.update(data)
    return store.settings
