import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.store import store


@pytest.fixture
def client():
    store.reset()
    with TestClient(app) as test_client:
        yield test_client
    store.reset()


@pytest.fixture
def auth_headers(client: TestClient):
    res = client.post("/v1/auth/login", json={"email": "admin@lhs.local", "password": "demo1234"})
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
