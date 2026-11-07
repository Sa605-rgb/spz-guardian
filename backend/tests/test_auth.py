def test_health(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_login_ok(client):
    res = client.post("/v1/auth/login", json={"email": "admin@lhs.local", "password": "demo1234"})
    assert res.status_code == 200
    body = res.json()
    assert body["token_type"] == "bearer"
    assert body["user"]["role"] == "Admin"


def test_login_bad(client):
    res = client.post("/v1/auth/login", json={"email": "admin@lhs.local", "password": "wrong"})
    assert res.status_code == 401


def test_me_requires_auth(client):
    assert client.get("/v1/auth/me").status_code == 401


def test_me_ok(client, auth_headers):
    res = client.get("/v1/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["email"] == "admin@lhs.local"


def test_facility(client):
    res = client.get("/v1/facilities/current")
    assert res.status_code == 200
    assert res.json()["ward"] == "Elizabeth Ward"
