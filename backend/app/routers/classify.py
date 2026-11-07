from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.classify import classify_session, extract_features

router = APIRouter()


class SessionIn(BaseModel):
    touch_count: float | None = None
    interaction_count: float | None = None
    rub_accumulated_seconds: float | None = None
    duration_seconds: float | None = None
    started_at: str | None = None
    finished_at: str | None = None
    reason: str | None = None
    end_trigger: str | None = None
    compliant: bool | None = None
    events: list[dict] = Field(default_factory=list)


@router.post("")
def classify(body: SessionIn):
    session = body.model_dump()
    return {
        "features": extract_features(session),
        "result": classify_session(session),
    }
