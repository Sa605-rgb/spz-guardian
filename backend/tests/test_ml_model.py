from app.ml_model import METRICS_PATH, MODEL_PATH, predict_session, train


def test_tree_recovers_protocol_on_held_out():
    metrics = train(seed=7)
    assert metrics["accuracy"] >= 0.95
    assert MODEL_PATH.exists()
    assert METRICS_PATH.exists()
    assert metrics["feature_importance"]["touches"] >= 0


def test_model_predicts_compliant_script():
    out = predict_session(
        {"touch_count": 1, "interaction_count": 2, "rub_accumulated_seconds": 22}
    )
    assert out["code"] == "M1-06"
    assert out["confidence"] > 0.5
