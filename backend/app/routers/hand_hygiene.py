from fastapi import APIRouter, Depends

from app.data.hand_hygiene import get_hand_hygiene
from app.query import period_param

router = APIRouter()


@router.get("/summary")
def summary(period: str = Depends(period_param)):
    return get_hand_hygiene(period)


@router.get("/groups")
def groups(period: str = Depends(period_param)):
    return get_hand_hygiene(period)["groupSummary"]


@router.get("/locations")
def locations(period: str = Depends(period_param)):
    return get_hand_hygiene(period)["locationObs"]


@router.get("/quality")
def quality(period: str = Depends(period_param)):
    return get_hand_hygiene(period)["qualityCriteria"]


@router.get("/dispensers")
def dispensers(period: str = Depends(period_param)):
    return get_hand_hygiene(period)["dispenserStats"]


@router.get("/gloves")
def gloves(period: str = Depends(period_param)):
    return get_hand_hygiene(period)["gloves"]
