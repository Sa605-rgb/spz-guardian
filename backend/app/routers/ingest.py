from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.deps import require_ingest_key

router = APIRouter(dependencies=[Depends(require_ingest_key)])


class EventIn(BaseModel):
    """Public-safe event metadata only — no detection internals."""

    event_code: str
    location: str
    role: str
    scenario: int | None = None
    compliant: bool | None = None
    timestamp: str | None = None


class HeartbeatIn(BaseModel):
    deviceId: str
    status: str = "Active"
    location: str | None = None


@router.post("/events")
def ingest_event(body: EventIn):
    return {"accepted": True, "event": body.model_dump()}


@router.post("/device-heartbeat")
def ingest_heartbeat(body: HeartbeatIn):
    return {"accepted": True, "device": body.model_dump()}
