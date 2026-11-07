from fastapi import APIRouter, Depends, Query
from fastapi.responses import PlainTextResponse

from app.data.catalog import REPORT_EVENTS
from app.data.testing import filter_events_by_period
from app.query import period_param
from app.store import store

router = APIRouter()


@router.get("/events")
def report_events(
    period: str = Depends(period_param),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    source = filter_events_by_period(store.events, period)
    if not source:
        source = REPORT_EVENTS
    start = (page - 1) * limit
    items = [
        {
            "id": e.get("key") or e["id"],
            "timestamp": e["timestamp"],
            "location": e["location"],
            "role": e["role"],
            "compliant": e["compliant"],
        }
        for e in source[start : start + limit]
    ]
    return {"items": items, "total": len(source), "page": page, "limit": limit}


@router.get("/events/export")
def export_events(period: str = Depends(period_param), format: str = Query("csv")):
    source = filter_events_by_period(store.events, period)
    lines = ["id,timestamp,location,role,compliant"]
    for event in source:
        lines.append(
            f"{event.get('key') or event['id']},{event['timestamp']},{event['location']},{event['role']},{event['compliant']}"
        )
    return PlainTextResponse("\n".join(lines), media_type="text/csv")
