"""WHO Moment 1 classifier.

Turns a ward session into one frozen POC script (M1-01…M1-06) or Not recognised.
Features: touch count, dispenser presses, rub seconds, dwell. Unmatched runs
are never dumped into non-opportunity.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

CONTACT_LIMIT = 20

POC = {
    "M1-01": {
        "script": "Enter zone, touch patient, no hand hygiene",
        "bucket": "directTouch",
        "compliant": False,
        "opportunity": True,
        "failures": ["No hand hygiene"],
    },
    "M1-02": {
        "script": "Enter zone, do not touch patient, leave <20s",
        "bucket": "nonOpportunity",
        "compliant": True,
        "opportunity": False,
        "failures": [],
    },
    "M1-03": {
        "script": "Enter, 1 dispense, rub <20s, then touch",
        "bucket": "qualityStack",
        "compliant": False,
        "opportunity": True,
        "failures": ["Ineffective dose", "Ineffective coverage", "Contact time <20s"],
    },
    "M1-04": {
        "script": "Enter, 1 dispense, rub >20s, then touch",
        "bucket": "ineffectiveDose",
        "compliant": False,
        "opportunity": True,
        "failures": ["Ineffective dose"],
    },
    "M1-05": {
        "script": "Enter, 2 dispenses, rub <20s, then touch",
        "bucket": "contactTime",
        "compliant": False,
        "opportunity": True,
        "failures": ["Ineffective coverage", "Contact time <20s"],
    },
    "M1-06": {
        "script": "Enter, 2 dispenses, rub >20s, then touch",
        "bucket": "compliant",
        "compliant": True,
        "opportunity": True,
        "failures": [],
    },
}


def _num(value: Any) -> float | None:
    if value is None or value == "":
        return None
    try:
        n = float(value)
    except (TypeError, ValueError):
        return None
    return n if n == n else None  # NaN check


def _event_count(session: dict, kind: str) -> int:
    return len([e for e in session.get("events") or [] if e.get("type") == kind])


def extract_features(session: dict) -> dict[str, Any]:
    """Numeric + text cues used by the decision tree."""
    touches = _num(session.get("touch_count"))
    if touches is None:
        count = _event_count(session, "touch")
        touches = float(count) if count else None
    interactions = _num(session.get("interaction_count"))
    if interactions is None:
        count = _event_count(session, "interaction")
        interactions = float(count) if count else None
    dwell = _num(session.get("duration_seconds"))
    if dwell is None and session.get("started_at") and session.get("finished_at"):
        try:
            start = datetime.fromisoformat(str(session["started_at"]).replace("Z", "+00:00"))
            end = datetime.fromisoformat(str(session["finished_at"]).replace("Z", "+00:00"))
            dwell = max((end - start).total_seconds(), 0)
        except ValueError:
            dwell = None
    text = f"{session.get('reason') or ''} {session.get('end_trigger') or ''}".lower()
    return {
        "touches": touches,
        "interactions": interactions,
        "rub": _num(session.get("rub_accumulated_seconds")),
        "dwell": dwell,
        "text": text,
        "compliant_flag": session.get("compliant"),
    }


def _from_spec(code: str) -> dict[str, Any]:
    spec = POC[code]
    return {
        "code": code,
        "scenario": code,
        "bucket": spec["bucket"],
        "compliant": spec["compliant"],
        "opportunity": spec["opportunity"],
        "failures": list(spec["failures"]),
        "label": "; ".join(spec["failures"]) or spec["script"],
        "script": spec["script"],
    }


def _nr(why: str) -> dict[str, Any]:
    return {
        "code": "NR",
        "scenario": "NR",
        "bucket": "notRecognised",
        "compliant": None,
        "opportunity": None,
        "failures": [why],
        "label": why,
        "script": "Does not match M1-01 to M1-06",
    }


def classify_session(session: dict) -> dict[str, Any]:
    """Map one session onto M1-01…M1-06. Anything else is NR."""
    f = extract_features(session)
    touches, interactions, rub, dwell, text = (
        f["touches"],
        f["interactions"],
        f["rub"],
        f["dwell"],
        f["text"],
    )
    has_touch = touches is not None and touches > 0
    no_touch = touches == 0

    if has_touch and interactions == 0:
        return _from_spec("M1-01")

    if no_touch and (interactions is None or interactions == 0):
        if dwell is not None and dwell <= CONTACT_LIMIT:
            return _from_spec("M1-02")
        if dwell is not None and dwell > CONTACT_LIMIT:
            return _nr("Left zone >20s without patient contact — not M1-02")
        pass_through = any(
            cue in text
            for cue in (
                "pass-through",
                "no hand-hygiene protocol",
                "without touching",
                "non-opportunity",
                "no hh opportunity",
                "within 20 second",
            )
        )
        if pass_through:
            return _from_spec("M1-02")
        return _nr("No patient contact, but dwell/cues do not match M1-02")

    if not has_touch:
        return _nr("Does not match M1-01 to M1-06")

    if interactions == 1:
        if rub is not None and rub < CONTACT_LIMIT:
            return _from_spec("M1-03")
        if rub is not None and rub >= CONTACT_LIMIT:
            return _from_spec("M1-04")
        if any(k in text for k in ("coverage", "<20", "time")):
            return _from_spec("M1-03")
        if any(k in text for k in ("dose", "only 1", "at least 2")):
            return _from_spec("M1-04")
        return _nr("1 dispense before touch, but rub time not recognised")

    if interactions == 2:
        if rub is not None and rub < CONTACT_LIMIT:
            return _from_spec("M1-05")
        if rub is not None and rub >= CONTACT_LIMIT:
            return _from_spec("M1-06")
        if any(k in text for k in ("coverage", "<20", "time")):
            return _from_spec("M1-05")
        if f["compliant_flag"] is True:
            return _from_spec("M1-06")
        return _nr("2 dispenses before touch, but rub time not recognised")

    if interactions is not None and interactions > 2:
        return _nr(f"{int(interactions)} dispenses — outside M1-01 to M1-06")

    if "zero" in text or "no hand hygiene" in text:
        return _from_spec("M1-01")
    return _nr("Does not match M1-01 to M1-06")
