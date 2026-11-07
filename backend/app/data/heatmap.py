"""Ward heatmap beds — same special beds as frontend dummyData.js."""

VULN_COLORS = ["#ffffff", "#FACC15", "#F97316", "#EF4444", "#9F1239"]
VULN_LABELS = ["Standard", "Increased", "High", "Infection", "Alert Org."]
RESIDUAL_COLORS = ["#22C55E", "#EAB308", "#EF4444"]


def _pick(arr, i):
    return arr[i % len(arr)]


def build_heatmap_bays() -> list[dict]:
    bays = []
    for bay_idx, bay in enumerate(["A", "B", "C", "D"]):
        start = bay_idx * 6 + 1
        beds = []
        for i in range(6):
            num = start + i
            bed_id = f"SPZ-{num:03d}"
            isolation = bed_id == "SPZ-002"
            high_risk = bed_id == "SPZ-007"
            residual_active = bed_id == "SPZ-001"

            vulnerability = _pick(VULN_COLORS, bay_idx + i)
            vuln_label = _pick(VULN_LABELS, bay_idx + i)
            residual = _pick(RESIDUAL_COLORS, bay_idx * 2 + i)
            residual_label = (
                "Compliant" if residual == "#22C55E" else "Warning" if residual == "#EAB308" else "Non-Compliant"
            )
            residual_score = 0 if residual == "#22C55E" else 3 if residual == "#EAB308" else 8

            if isolation:
                vulnerability = "#EF4444"
                vuln_label = "Infection"
                residual = "#EF4444"
                residual_label = "Non-Compliant"
                residual_score = 10
            if high_risk:
                residual = "#EF4444"
                residual_label = "Non-Compliant"
                residual_score = 11
                vuln_label = "High"
                vulnerability = "#F97316"
            if residual_active:
                residual = "#EF4444"
                residual_label = "Non-Compliant"
                residual_score = 9

            beds.append(
                {
                    "bed": f"Bed {i + 1}",
                    "id": bed_id,
                    "spzNum": num,
                    "vulnLabel": vuln_label,
                    "residualLabel": residual_label,
                    "residualScore": residual_score,
                    "isolation": isolation,
                    "highRiskResidual": high_risk,
                    "residualActive": residual_active,
                }
            )
        bays.append(
            {
                "label": f"BAY {bay}",
                "range": f"SPZ{start}–SPZ{start + 5}",
                "beds": beds,
            }
        )
    return bays


HEATMAP_STATS = {
    "totalBeds": 24,
    "compliantBeds": 19,
    "compliantPct": "79.2%",
    "warningZones": 3,
    "warningPct": "12.5%",
    "highRiskBeds": 2,
    "highRiskPct": "8.3%",
}

HEATMAP_RESIDUAL_DONUT = [
    {"name": "Low", "value": 19},
    {"name": "Medium", "value": 3},
    {"name": "High", "value": 2},
]

HEATMAP_ISOLATION = [
    {"id": "SPZ-002", "reason": "Known Infection", "type": "isolation"},
    {"id": "SPZ-007", "reason": "High Residual Risk", "type": "high"},
]

HEATMAP_CLEANING = [
    {"task": "Morning Clean", "pct": 96, "trend": "up"},
    {"task": "Terminal Clean", "pct": 88, "trend": "flat"},
    {"task": "Disinfection", "pct": 91, "trend": "up"},
]

HEATMAP_BAY_COMPLIANCE = [
    {"bay": "Bay A", "pct": 92},
    {"bay": "Bay B", "pct": 74},
    {"bay": "Bay C", "pct": 88},
    {"bay": "Bay D", "pct": 85},
]

HEATMAP_ALERTS = [
    {"text": "High residual risk detected — SPZ-007", "time": "2 min ago", "level": "high"},
    {"text": "Isolation active — SPZ-002 Known Infection", "time": "8 min ago", "level": "high"},
    {"text": "Residual risk active on SPZ-001", "time": "15 min ago", "level": "warn"},
]
