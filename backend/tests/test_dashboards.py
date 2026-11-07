def test_testing_stats_today(client):
    res = client.get("/v1/testing/stats", params={"period": "Today"})
    assert res.status_code == 200
    body = res.json()
    assert body["totalEvents"] > 0
    assert "moment1Compliant" in body


def test_testing_events_pagination(client):
    res = client.get("/v1/testing/events", params={"period": "Today", "page": 1, "limit": 5})
    assert res.status_code == 200
    body = res.json()
    assert len(body["items"]) <= 5
    assert body["total"] >= len(body["items"])


def test_testing_event_detail(client):
    listed = client.get("/v1/testing/events", params={"limit": 1}).json()["items"][0]
    res = client.get(f"/v1/testing/events/{listed['key']}")
    assert res.status_code == 200
    assert "metadata" in res.json()


def test_hand_hygiene_summary_week(client):
    res = client.get("/v1/hand-hygiene/summary", params={"period": "This Week"})
    assert res.status_code == 200
    body = res.json()
    nurses = next(g for g in body["groupSummary"] if g["group"] == "Nurses")
    assert nurses["total"] == 210


def test_environmental_kpis(client):
    res = client.get("/v1/environmental/kpis")
    assert res.status_code == 200
    assert res.json()["overallCompliance"] == 78


def test_heatmap_has_24_beds(client):
    res = client.get("/v1/heatmap")
    assert res.status_code == 200
    bays = res.json()["bays"]
    assert sum(len(b["beds"]) for b in bays) == 24
    isolation = next(bed for bay in bays for bed in bay["beds"] if bed["id"] == "SPZ-002")
    assert isolation["isolation"] is True
