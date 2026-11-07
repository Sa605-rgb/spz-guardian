from app.classify import classify_session


def test_m1_01_touch_no_hygiene():
    out = classify_session({"touch_count": 1, "interaction_count": 0})
    assert out["code"] == "M1-01"
    assert out["compliant"] is False


def test_m1_02_short_visit_no_touch():
    out = classify_session({"touch_count": 0, "interaction_count": 0, "duration_seconds": 12})
    assert out["code"] == "M1-02"
    assert out["opportunity"] is False


def test_long_dwell_no_touch_is_not_recognised():
    out = classify_session({"touch_count": 0, "interaction_count": 0, "duration_seconds": 45})
    assert out["code"] == "NR"


def test_m1_03_one_pump_short_rub():
    out = classify_session(
        {"touch_count": 1, "interaction_count": 1, "rub_accumulated_seconds": 8}
    )
    assert out["code"] == "M1-03"
    assert "Contact time <20s" in out["failures"]


def test_m1_04_one_pump_long_rub():
    out = classify_session(
        {"touch_count": 1, "interaction_count": 1, "rub_accumulated_seconds": 25}
    )
    assert out["code"] == "M1-04"


def test_m1_05_two_pumps_short_rub():
    out = classify_session(
        {"touch_count": 1, "interaction_count": 2, "rub_accumulated_seconds": 10}
    )
    assert out["code"] == "M1-05"


def test_m1_06_compliant():
    out = classify_session(
        {"touch_count": 1, "interaction_count": 2, "rub_accumulated_seconds": 22}
    )
    assert out["code"] == "M1-06"
    assert out["compliant"] is True
    assert out["failures"] == []


def test_three_dispenses_not_recognised():
    out = classify_session({"touch_count": 1, "interaction_count": 3})
    assert out["code"] == "NR"


def test_classify_endpoint(client):
    res = client.post(
        "/v1/classify",
        json={"touch_count": 1, "interaction_count": 2, "rub_accumulated_seconds": 22},
    )
    assert res.status_code == 200
    body = res.json()
    assert body["rules"]["code"] == "M1-06"
    assert body["model"]["code"] == "M1-06"
    assert body["features"]["interactions"] == 2
