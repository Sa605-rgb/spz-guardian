from fastapi import APIRouter

from app.data.catalog import (
    ENV_HIGH_TOUCH,
    ENV_KPIS,
    ENV_MEDICAL_DEVICES,
    ENV_QUALITY,
    ENV_SHARED_EQUIPMENT,
)

router = APIRouter()


@router.get("/kpis")
def kpis():
    return ENV_KPIS


@router.get("/shared-equipment")
def shared_equipment():
    return ENV_SHARED_EQUIPMENT


@router.get("/high-touch")
def high_touch():
    return ENV_HIGH_TOUCH


@router.get("/medical-devices")
def medical_devices():
    return ENV_MEDICAL_DEVICES


@router.get("/quality")
def quality():
    return ENV_QUALITY
