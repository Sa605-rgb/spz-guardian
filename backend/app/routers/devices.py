from fastapi import APIRouter, HTTPException

from app.store import store

router = APIRouter()


@router.get("")
def list_devices():
    items = store.devices
    return {
        "items": items,
        "totals": {
            "total": len(items),
            "active": sum(1 for d in items if d["status"] == "Active"),
            "offline": sum(1 for d in items if d["status"] == "Offline"),
        },
    }


@router.get("/{device_id}")
def get_device(device_id: str):
    for device in store.devices:
        if device["id"] == device_id:
            return device
    raise HTTPException(status_code=404, detail="Device not found")
