from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.store import store

router = APIRouter()


class TaskPatch(BaseModel):
    completed: str | None = None
    status: str | None = None


@router.get("/tasks")
def list_tasks(section: str | None = Query(default=None)):
    sections = store.care_sections
    if section:
        sections = [s for s in sections if s["id"] == section]
        if not sections:
            raise HTTPException(status_code=404, detail="Unknown section")
    return {"sections": sections}


@router.patch("/tasks/{task_id}")
def patch_task(task_id: str, body: TaskPatch):
    for section in store.care_sections:
        for row in section["rows"]:
            if row["id"] == task_id:
                if body.completed is not None:
                    row["completed"] = body.completed
                if body.status is not None:
                    if body.status not in ("on_time", "late", "missed"):
                        raise HTTPException(status_code=400, detail="Invalid status")
                    row["status"] = body.status
                return row
    raise HTTPException(status_code=404, detail="Task not found")
