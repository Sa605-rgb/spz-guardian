"""Environmental + heatmap + patient care + ops seed data."""

FACILITY = {
    "hospital": "Bangor Hospital",
    "ward": "Elizabeth Ward",
    "location": "Elizabeth Ward, Bangor Hospital",
    "version": "v2.4.1",
    "hospitalId": "bangor",
    "wardId": "elizabeth",
}

ENV_KPIS = {
    "overallCompliance": 78,
    "nonCompliant": 22,
    "activeZones": 15,
    "overallTrend": "↑ 6% from last 7 days",
    "nonCompliantTrend": "↑ 4% from last 7 days",
    "zonesTrend": "No change from last 7 days",
}

ENV_SHARED_EQUIPMENT = [
    {"location": "Bay A SPZ001", "cleanEntry": True, "preContact": True, "postUse": True, "exitDisinfect": True},
    {"location": "Bay B SPZ007", "cleanEntry": True, "preContact": False, "postUse": True, "exitDisinfect": True},
    {"location": "Bay C SPZ013", "cleanEntry": True, "preContact": True, "postUse": False, "exitDisinfect": True},
]

ENV_HIGH_TOUCH = [
    {"location": "Bay A SPZ001", "task": "Bed Rails", "schedule": "08:00", "completed": "07:55", "ok": True},
    {"location": "Bay B SPZ007", "task": "Call Buttons", "schedule": "09:00", "completed": "09:30", "ok": False},
    {"location": "Bay C SPZ013", "task": "Light Switches", "schedule": "10:00", "completed": "10:05", "ok": False},
]

ENV_MEDICAL_DEVICES = [
    {"location": "Bay A SPZ001", "device": "Reusable Steth.", "preTouch": True, "postTouch": True, "disposal": None},
    {"location": "Bay B SPZ007", "device": "Reusable BP Cuff", "preTouch": True, "postTouch": False, "disposal": None},
    {"location": "Bay C SPZ013", "device": "Dispos. Syringe", "preTouch": None, "postTouch": None, "disposal": True},
]

ENV_QUALITY = [
    {"location": "Bay A SPZ001", "coverage": "100%", "sequence": True, "contact": "30s", "ok": True},
    {"location": "Bay B SPZ007", "coverage": "70%", "sequence": False, "contact": "15s", "ok": False},
]

SAFETY_EVENTS = [
    {"label": "Falls", "count": 2},
    {"label": "Medication", "count": 1},
    {"label": "Infection", "count": 0},
    {"label": "Other", "count": 0},
]

SAFETY_ALERTS = [
    {"title": "Fall risk", "detail": "2 patients identified", "time": "Just now", "type": "warning"},
    {"title": "Low compliance", "detail": "Ward B below 80%", "time": "10 min ago", "type": "caution"},
    {"title": "Safety audit due", "detail": "Next week", "time": "1 hour ago", "type": "info"},
]

SAFETY_SUMMARY = {
    "overallCompliance": 88,
    "nonCompliant": 12,
    "alertCount": 3,
    "sparklines": {
        "up": [40, 45, 42, 55, 60, 58, 70],
        "down": [70, 65, 68, 55, 50, 48, 40],
        "flat": [50, 52, 50, 51, 50, 52, 50],
    },
}

REPORT_EVENTS = [
    {"id": "PZ01-E-1", "timestamp": "10:24:15", "location": "ICU-R3", "role": "Doctor", "compliant": False},
    {"id": "PZ01-E-2", "timestamp": "10:18:02", "location": "Ward-7B", "role": "Nurse", "compliant": True},
    {"id": "PZ01-E-3", "timestamp": "10:12:44", "location": "OT-2", "role": "HCA", "compliant": False},
    {"id": "PZ01-E-4", "timestamp": "09:58:11", "location": "ICU-R1", "role": "Doctor", "compliant": True},
    {"id": "PZ01-E-5", "timestamp": "09:45:33", "location": "Ward-5A", "role": "Nurse", "compliant": True},
]

ALERTS = [
    {
        "id": 1,
        "severity": "critical",
        "title": "Missed Hand Hygiene — ICU Room 3",
        "detail": "Dr. Ahmed — 10:24 AM",
        "status": "Unresolved • Critical",
    },
    {
        "id": 2,
        "severity": "warning",
        "title": "Low Liquid — SPZ02",
        "detail": "Refill needed — 20% remaining",
        "status": "In Progress • Warning",
    },
    {
        "id": 3,
        "severity": "info",
        "title": "Offline Unit — CAM-05",
        "detail": "Device disconnected — 5 min ago",
        "status": "Unresolved • Info",
    },
]

DEVICES = [
    {"id": "CAM-01", "status": "Active", "location": "ICU-R3", "compliance": 86},
    {"id": "CAM-02", "status": "Active", "location": "Ward-7B", "compliance": 92},
    {"id": "CAM-03", "status": "Offline", "location": "OT-2", "compliance": None},
    {"id": "CAM-04", "status": "Active", "location": "ICU-R1", "compliance": 78},
    {"id": "CAM-05", "status": "Active", "location": "Ward-5A", "compliance": 88},
]

_NAMED_USERS = [
    {"id": 1, "name": "Dr. Ahmed", "role": "Admin", "status": "Active", "lastActive": "Today 10:24 AM"},
    {"id": 2, "name": "Nurse Khan", "role": "Manager", "status": "Active", "lastActive": "Today 09:15 AM"},
    {"id": 3, "name": "Dr. Ali", "role": "Viewer", "status": "Inactive", "lastActive": "Yesterday"},
    {"id": 4, "name": "Nurse Lee", "role": "Staff", "status": "Active", "lastActive": "Today 11:02 AM"},
    {"id": 5, "name": "Dr. Smith", "role": "Staff", "status": "Active", "lastActive": "2 days ago"},
]


def build_users() -> list[dict]:
    """UI shows 28 users; pad named staff so pagination works."""
    extras = []
    names = [
        "Nurse Patel", "Dr. Evans", "HCA Morgan", "Nurse Hughes", "Dr. Williams",
        "Porter Davies", "Nurse Roberts", "HCA Clarke", "Dr. Thomas", "Nurse Lewis",
        "Cleaner Jones", "Nurse Walker", "Dr. Harris", "HCA Martin", "Nurse Wright",
        "Dr. Scott", "Nurse Green", "HCA Baker", "Nurse Adams", "Dr. Nelson",
        "Nurse Hill", "HCA Allen", "Nurse Young",
    ]
    for i, name in enumerate(names, start=6):
        extras.append(
            {
                "id": i,
                "name": name,
                "role": "Staff" if i % 4 else "Viewer",
                "status": "Active" if i % 5 else "Inactive",
                "lastActive": "This week" if i % 3 else "Yesterday",
            }
        )
    return [*_NAMED_USERS, *extras]


SETTINGS = {
    "emailNotifications": True,
    "darkMode": False,
    "autoRefresh": True,
    "auditLogging": True,
    "hospital": FACILITY["hospital"],
    "ward": FACILITY["ward"],
}

DEMO_USER = {
    "id": 1,
    "name": "Dr. Ahmed",
    "email": "admin@lhs.local",
    "role": "Admin",
    "status": "Active",
}
