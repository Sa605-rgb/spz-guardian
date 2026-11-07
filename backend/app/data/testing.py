"""Testing Dashboard events — same scenarios as frontend dummyData.js."""

EVENT_CODES = {
    "E001": "Entry",
    "EX001": "Exit",
    "PT001": "Patient Touched",
    "PNT001": "Patient Not Touched",
    "D1001": "1 press dispenser",
    "D2001": "2 presses dispenser",
    "D0001": "Dispenser Ignored",
    "HR>20001": "Hand rub >20 sec",
    "HR<20001": "Hand rub <20 sec",
    "SET001": "Shared Equipment Touched",
    "HTST001": "High Touch Surface Touched",
    "MDPT001": "Medical Device Touched Patient",
}

ROLES = ["Doctor", "Nurse", "HCA", "Cleaner"]
BAYS = ["A", "B", "C", "D"]
CODE_POOL = [
    "E001",
    "EX001",
    "PT001",
    "PNT001",
    "D1001",
    "D2001",
    "D0001",
    "HR>20001",
    "HR<20001",
    "SET001",
    "HTST001",
    "MDPT001",
]

_SEED = [
    {
        "id": "E001",
        "event_code": "HR>20001",
        "scenario": 2,
        "compliant": True,
        "role": "Doctor",
        "location": "Bay A SPZ001",
        "period": "today",
    },
    {
        "id": "EX001",
        "event_code": "EX001",
        "scenario": 1,
        "compliant": True,
        "role": "Nurse",
        "location": "Bay A SPZ002",
        "period": "today",
    },
    {
        "id": "PT001",
        "event_code": "PT001",
        "scenario": 3,
        "compliant": False,
        "role": "HCA",
        "location": "Bay B SPZ007",
        "period": "today",
    },
    {
        "id": "D1001",
        "event_code": "D1001",
        "scenario": 4,
        "compliant": False,
        "role": "Cleaner",
        "location": "Bay C SPZ013",
        "period": "today",
    },
    {
        "id": "HR>20001",
        "event_code": "HR>20001",
        "scenario": 2,
        "compliant": True,
        "role": "Doctor",
        "location": "Bay D SPZ019",
        "period": "today",
    },
]


def bay_location(spz_num: int, bay: str = "A") -> str:
    return f"Bay {bay} SPZ{spz_num:03d}"


def build_all_testing_events() -> list[dict]:
    """Build the 34 demo events used by the Testing Dashboard."""
    rows = []
    for i, event in enumerate(_SEED):
        rows.append(
            {
                **event,
                "key": f"row-{event['id']}",
                "timestamp": f"27-07-2026 10:{24 + i:02d}:15",
            }
        )

    while len(rows) < 34:
        i = len(rows)
        scenario = (i % 4) + 1
        compliant = scenario in (1, 2)
        code = CODE_POOL[i % len(CODE_POOL)]
        bay = BAYS[i % 4]
        spz = (i % 24) + 1
        period = "today" if i < 12 else "week" if i < 24 else "month"
        day = "27" if i < 24 else "20"
        rows.append(
            {
                "key": f"row-{i + 1}",
                "id": code,
                "event_code": code,
                "scenario": scenario,
                "compliant": compliant,
                "role": ROLES[i % len(ROLES)],
                "location": bay_location(spz, bay),
                "period": period,
                "timestamp": f"{day}-07-2026 {8 + (i % 10):02d}:{i % 60:02d}:00",
            }
        )
    return rows


def filter_events_by_period(events: list[dict], period: str) -> list[dict]:
    if period == "Today":
        return [e for e in events if e["period"] == "today"]
    if period == "This Week":
        return [e for e in events if e["period"] in ("today", "week")]
    return list(events)


def calc_testing_stats(events: list[dict]) -> dict:
    return {
        "totalEvents": len(events),
        "moment1Compliant": sum(1 for e in events if e["scenario"] == 2 and e["compliant"]),
        "moment1NonCompliant": sum(
            1 for e in events if e["scenario"] in (3, 4) and not e["compliant"]
        ),
        "nonOpportunity": sum(1 for e in events if e["scenario"] == 1),
    }


def build_event_metadata(event: dict) -> dict:
    return {
        "event": event["id"],
        "location": event["location"],
        "role": event["role"],
        "scenario": event["scenario"],
        "compliance": event["compliant"],
        "event_code": event["event_code"],
    }
