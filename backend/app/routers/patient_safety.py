from fastapi import APIRouter

from app.data.catalog import SAFETY_ALERTS, SAFETY_EVENTS, SAFETY_SUMMARY

router = APIRouter()


@router.get("/summary")
def summary():
    return {**SAFETY_SUMMARY, "events": SAFETY_EVENTS, "alerts": SAFETY_ALERTS}
