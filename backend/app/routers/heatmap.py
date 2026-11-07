from fastapi import APIRouter

from app.data import heatmap
from app.store import store

router = APIRouter()


@router.get("")
@router.get("/")
def heatmap_payload():
    return {
        "stats": heatmap.HEATMAP_STATS,
        "bays": store.heatmap_bays,
        "residualDonut": heatmap.HEATMAP_RESIDUAL_DONUT,
        "isolationList": heatmap.HEATMAP_ISOLATION,
        "cleaning": heatmap.HEATMAP_CLEANING,
        "bayCompliance": heatmap.HEATMAP_BAY_COMPLIANCE,
        "alerts": heatmap.HEATMAP_ALERTS,
    }
