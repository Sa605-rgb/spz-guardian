from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.store import store

router = APIRouter()


class AlertPatch(BaseModel):
    status: str


@router.get("")
def list_alerts(severity: str | None = Query(default=None)):
    items = store.alerts
    if severity:
        items = [a for a in items if a["severity"] == severity]
    totals = {
        "total": len(store.alerts),
        "critical": sum(1 for a in store.alerts if a["severity"] == "critical"),
        "warning": sum(1 for a in store.alerts if a["severity"] == "warning"),
        "info": sum(1 for a in store.alerts if a["severity"] == "info"),
    }
    return {"items": items, "totals": totals}


@router.patch("/{alert_id}")
def patch_alert(alert_id: int, body: AlertPatch):
    for alert in store.alerts:
        if alert["id"] == alert_id:
            alert["status"] = body.status
            return alert
    raise HTTPException(status_code=404, detail="Alert not found")
