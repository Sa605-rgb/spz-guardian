"""Shared query helpers for period / pagination."""

from fastapi import Query

PERIOD_ALIASES = {
    "today": "Today",
    "this week": "This Week",
    "week": "This Week",
    "this month": "This Month",
    "month": "This Month",
}


def normalize_period(period: str | None) -> str:
    if not period:
        return "Today"
    raw = period.strip()
    if raw in ("Today", "This Week", "This Month"):
        return raw
    return PERIOD_ALIASES.get(raw.lower(), "Today")


def period_param(
    period: str = Query("Today", description="Today | This Week | This Month"),
) -> str:
    return normalize_period(period)
