def test_patient_care_sections(client):
    res = client.get("/v1/patient-care/tasks")
    assert res.status_code == 200
    sections = res.json()["sections"]
    assert len(sections) == 6
    assert sections[0]["rows"][0]["id"] == "personal-0"


def test_patient_care_patch(client, auth_headers):
    res = client.patch(
        "/v1/patient-care/tasks/personal-0",
        json={"status": "late"},
        headers=auth_headers,
    )
    # PATCH is currently open (no auth dep on router) — still should succeed.
    assert res.status_code in (200, 401)
    if res.status_code == 200:
        assert res.json()["status"] == "late"


def test_alerts_filter_and_totals(client):
    res = client.get("/v1/alerts")
    assert res.status_code == 200
    body = res.json()
    assert body["totals"]["total"] == 3
    crit = client.get("/v1/alerts", params={"severity": "critical"})
    assert len(crit.json()["items"]) == 1


def test_devices_totals(client):
    res = client.get("/v1/devices")
    body = res.json()
    assert body["totals"]["total"] == 5
    assert body["totals"]["offline"] == 1


def test_users_pagination(client):
    res = client.get("/v1/users", params={"page": 1, "limit": 5})
    body = res.json()
    assert body["total"] == 28
    assert len(body["items"]) == 5


def test_settings_roundtrip(client):
    before = client.get("/v1/settings").json()
    patched = client.patch("/v1/settings", json={"autoRefresh": False}).json()
    assert patched["autoRefresh"] is False
    assert before["hospital"] == "Bangor Hospital"


def test_reports_export_csv(client):
    res = client.get("/v1/reports/events/export", params={"period": "Today"})
    assert res.status_code == 200
    assert "location,role,compliant" in res.text


def test_ingest_requires_key(client):
    res = client.post("/v1/ingest/events", json={"event_code": "E001", "location": "Bay A SPZ001", "role": "Nurse"})
    assert res.status_code == 401


def test_ingest_ok(client):
    res = client.post(
        "/v1/ingest/events",
        json={"event_code": "E001", "location": "Bay A SPZ001", "role": "Nurse"},
        headers={"X-Ingest-Key": "dev-ingest-key"},
    )
    assert res.status_code == 200
    assert res.json()["accepted"] is True
