from fastapi import APIRouter, Depends, HTTPException, Query

from app.config import settings
from app.data.testing import (
    EVENT_CODES,
    build_event_metadata,
    calc_testing_stats,
    filter_events_by_period,
)
from app.query import period_param
from app.store import store

router = APIRouter()


@router.get("/stats")
def testing_stats(period: str = Depends(period_param)):
    filtered = filter_events_by_period(store.events, period)
    return calc_testing_stats(filtered)


@router.get("/events")
def list_events(
    period: str = Depends(period_param),
    page: int = Query(1, ge=1),
    limit: int = Query(5, ge=1, le=100),
):
    filtered = filter_events_by_period(store.events, period)
    start = (page - 1) * limit
    items = filtered[start : start + limit]
    return {"items": items, "total": len(filtered), "page": page, "limit": limit, "eventCodes": EVENT_CODES}


@router.get("/events/{event_key}")
def get_event(event_key: str, period: str = Depends(period_param)):
    filtered = filter_events_by_period(store.events, period)
    event = next((e for e in filtered if e["key"] == event_key or e["id"] == event_key), None)
    if not event:
        event = store.event_by_key(event_key)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return {**event, "metadata": build_event_metadata(event)}


@router.get("/events/{event_key}/video")
def event_video(event_key: str):
    event = store.event_by_key(event_key)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return {
        "eventKey": event["key"],
        "url": f"{settings.frontend_origin}/videos/hospital-event.mp4",
    }
