"""Sklearn Decision Tree baseline for WHO Moment 1.

Rules in classify.py are the protocol (source of truth). This tree is trained
on protocol-labeled sessions so we can score a supervised baseline and expose
feature importance — not a replacement for the workbook scripts.
"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
from joblib import dump, load
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

from app.classify import classify_session, extract_features

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "moment1_tree.joblib"
METRICS_PATH = ROOT / "models" / "moment1_metrics.json"
FEATURE_NAMES = ["touches", "interactions", "rub", "dwell"]
LABELS = ["M1-01", "M1-02", "M1-03", "M1-04", "M1-05", "M1-06", "NR"]


def vector(session: dict) -> list[float]:
    f = extract_features(session)
    return [
        -1.0 if f[name] is None else float(f[name])
        for name in FEATURE_NAMES
    ]


def _sample_sessions(rng: np.random.Generator, n_each: int = 80) -> list[dict]:
    rows: list[dict] = []
    for _ in range(n_each):
        rows.append({"touch_count": int(rng.integers(1, 4)), "interaction_count": 0})
        rows.append(
            {
                "touch_count": 0,
                "interaction_count": 0,
                "duration_seconds": float(rng.uniform(2, 20)),
            }
        )
        rows.append(
            {
                "touch_count": 1,
                "interaction_count": 1,
                "rub_accumulated_seconds": float(rng.uniform(1, 19)),
            }
        )
        rows.append(
            {
                "touch_count": 1,
                "interaction_count": 1,
                "rub_accumulated_seconds": float(rng.uniform(20, 40)),
            }
        )
        rows.append(
            {
                "touch_count": 1,
                "interaction_count": 2,
                "rub_accumulated_seconds": float(rng.uniform(1, 19)),
            }
        )
        rows.append(
            {
                "touch_count": 1,
                "interaction_count": 2,
                "rub_accumulated_seconds": float(rng.uniform(20, 40)),
            }
        )
        rows.append(
            {
                "touch_count": 1,
                "interaction_count": int(rng.integers(3, 6)),
                "rub_accumulated_seconds": float(rng.uniform(0, 40)),
            }
        )
    return rows


def train(seed: int = 42) -> dict:
    rng = np.random.default_rng(seed)
    sessions = _sample_sessions(rng)
    X = np.array([vector(s) for s in sessions], dtype=float)
    y = np.array([classify_session(s)["code"] for s in sessions])
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=seed, stratify=y
    )
    clf = DecisionTreeClassifier(max_depth=6, random_state=seed)
    clf.fit(X_train, y_train)
    pred = clf.predict(X_test)
    metrics = {
        "accuracy": float(accuracy_score(y_test, pred)),
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "labels": LABELS,
        "feature_importance": {
            name: float(v) for name, v in zip(FEATURE_NAMES, clf.feature_importances_)
        },
        "report": classification_report(y_test, pred, output_dict=True, zero_division=0),
    }
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    dump({"model": clf, "features": FEATURE_NAMES, "labels": list(clf.classes_)}, MODEL_PATH)
    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics


_bundle = None


def _load():
    global _bundle
    if _bundle is None:
        if not MODEL_PATH.exists():
            train()
        _bundle = load(MODEL_PATH)
    return _bundle


def predict_session(session: dict) -> dict:
    bundle = _load()
    clf: DecisionTreeClassifier = bundle["model"]
    x = np.array([vector(session)], dtype=float)
    code = str(clf.predict(x)[0])
    proba = clf.predict_proba(x)[0]
    classes = list(clf.classes_)
    return {
        "code": code,
        "confidence": float(max(proba)),
        "proba": {str(c): float(p) for c, p in zip(classes, proba)},
    }
