from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    alerts,
    auth,
    classify,
    devices,
    environmental,
    hand_hygiene,
    heatmap,
    ingest,
    patient_care,
    patient_safety,
    reports,
    settings as settings_router,
    testing,
    users,
)

app = FastAPI(
    title="SPZ Guardian API",
    version="0.1.0",
    description="Dashboard API for SMART Patient Zone / SPZ Guardian. Returns outcome data only.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix = settings.api_prefix

app.include_router(auth.router, prefix=f"{prefix}/auth", tags=["auth"])
app.include_router(auth.facility_router, prefix=f"{prefix}/facilities", tags=["facilities"])
app.include_router(classify.router, prefix=f"{prefix}/classify", tags=["classify"])
app.include_router(testing.router, prefix=f"{prefix}/testing", tags=["testing"])
app.include_router(hand_hygiene.router, prefix=f"{prefix}/hand-hygiene", tags=["hand-hygiene"])
app.include_router(environmental.router, prefix=f"{prefix}/environmental", tags=["environmental"])
app.include_router(heatmap.router, prefix=f"{prefix}/heatmap", tags=["heatmap"])
app.include_router(patient_care.router, prefix=f"{prefix}/patient-care", tags=["patient-care"])
app.include_router(patient_safety.router, prefix=f"{prefix}/patient-safety", tags=["patient-safety"])
app.include_router(reports.router, prefix=f"{prefix}/reports", tags=["reports"])
app.include_router(alerts.router, prefix=f"{prefix}/alerts", tags=["alerts"])
app.include_router(devices.router, prefix=f"{prefix}/devices", tags=["devices"])
app.include_router(users.router, prefix=f"{prefix}/users", tags=["users"])
app.include_router(settings_router.router, prefix=f"{prefix}/settings", tags=["settings"])
app.include_router(ingest.router, prefix=f"{prefix}/ingest", tags=["ingest"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "spz-guardian-api"}
