"""
Risk prediction model — Ridge baseline + Gradient Boosted Trees.

Run as a script to train, evaluate both models on data/journeys.csv, and save
the GBT artifact to models/risk_model.joblib:

    python -m models.Risk_Prediction          # from services/ml-api/

Imported by the FastAPI app for inference: see RiskPredictor.

The synthetic data is generated from a known weighted combination of features
plus noise (see data/generate_fake_data.py::compute_risk). Ridge gives an
interpretable baseline; GBT serves as the production model because it picks
up the non-linear temperature-extreme bonus and the capped elevation/distance
terms that Ridge underfits.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import accuracy_score, mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

from .features import (
    FEATURE_ORDER,
    NUMERIC_FEATURES,
    featurize,
    risk_level_from_score,
)

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
ML_API_DIR = os.path.dirname(THIS_DIR)
DATA_PATH = os.path.join(ML_API_DIR, "data", "journeys.csv")
MODEL_PATH = os.path.join(THIS_DIR, "risk_model.joblib")

# Top-K factors returned to the API caller.
TOP_K_FACTORS = 3
# Minimum absolute contribution (in risk-score units) before a feature is
# surfaced as a contributing factor — filters out near-zero noise.
FACTOR_MIN_CONTRIBUTION = 0.02


# ── Training ────────────────────────────────────────────
def _build_xy(df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
    # user_experience = count of prior journeys for this user. The generator
    # uses it as an input but doesn't persist the column, so we recompute it
    # from chronological order within each user.
    df = df.sort_values(["user_id", "started_at"]).copy()
    df["user_experience"] = df.groupby("user_id").cumcount()
    X = np.array([featurize(row) for row in df.to_dict(orient="records")])
    y = df["risk_score"].to_numpy()
    return X, y


def _evaluate(name: str, model, X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, float]:
    pred = np.clip(model.predict(X_test), 0.0, 1.0)
    mae = mean_absolute_error(y_test, pred)
    rmse = float(np.sqrt(np.mean((y_test - pred) ** 2)))
    r2 = r2_score(y_test, pred)
    pred_levels = [risk_level_from_score(p) for p in pred]
    true_levels = [risk_level_from_score(t) for t in y_test]
    bucket_acc = accuracy_score(true_levels, pred_levels)
    print(
        f"  {name:8s}  MAE={mae:.4f}  RMSE={rmse:.4f}  "
        f"R^2={r2:.4f}  bucket_acc={bucket_acc:.3f}"
    )
    return {"mae": mae, "rmse": rmse, "r2": r2, "bucket_acc": bucket_acc}


def train(data_path: str = DATA_PATH, model_path: str = MODEL_PATH) -> Dict:
    print(f"Loading {data_path}")
    df = pd.read_csv(data_path)
    print(f"  {len(df)} journeys")

    X, y = _build_xy(df)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("\nTraining models...")
    ridge = Ridge(alpha=1.0, random_state=42)
    ridge.fit(X_train, y_train)

    gbt = GradientBoostingRegressor(
        n_estimators=500,
        max_depth=3,
        learning_rate=0.05,
        min_samples_leaf=10,
        subsample=0.85,
        validation_fraction=0.15,
        n_iter_no_change=25,
        random_state=42,
    )
    gbt.fit(X_train, y_train)
    print(f"  gbt stopped at {gbt.n_estimators_} trees")

    print("\nTest-set metrics:")
    ridge_metrics = _evaluate("ridge", ridge, X_test, y_test)
    gbt_metrics = _evaluate("gbt", gbt, X_test, y_test)

    # Pick the better model by RMSE — the synthetic data is mostly linear, so
    # Ridge often wins, but as the data shifts toward real escalation outcomes
    # GBT should take over. Letting the data decide keeps that handoff clean.
    if gbt_metrics["rmse"] <= ridge_metrics["rmse"]:
        winner_name, winner_model = "gbt", gbt
    else:
        winner_name, winner_model = "ridge", ridge
    print(f"\nServing model: {winner_name}")

    # Population baseline used at inference time for contribution attribution.
    feature_baseline = X_train.mean(axis=0)

    artifact = {
        "model": winner_model,
        "model_name": winner_name,
        "ridge": ridge,
        "gbt": gbt,
        "feature_order": FEATURE_ORDER,
        "feature_baseline": feature_baseline,
        "metrics": {"ridge": ridge_metrics, "gbt": gbt_metrics},
        "n_train": len(X_train),
        "n_test": len(X_test),
    }

    joblib.dump(artifact, model_path)
    print(f"\nSaved model artifact -> {model_path}")
    return artifact


# ── Inference ───────────────────────────────────────────
@dataclass
class RiskPrediction:
    risk_score: float
    risk_level: str
    contributing_factors: List[str]


_NUMERIC_LABELS = {
    "is_solo": "solo journey",
    "is_night": "night-time start",
    "temperature_f": "temperature",
    "elevation_gain_m": "elevation gain",
    "distance_km": "route distance",
    "user_experience": "user experience",
}

_GROUP_NOUN = {
    "journey_type": "journey",
    "weather_condition": "weather",
    "terrain_type": "terrain",
}


class RiskPredictor:
    """
    Loads the trained artifact and produces predictions + contributing factors.

    Contributing factors come from a one-vs-baseline contribution: replace each
    feature with its training-set mean and see how the prediction shifts. This
    works for any sklearn regressor without pulling in SHAP.
    """

    def __init__(self, model_path: str = MODEL_PATH):
        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"No trained model at {model_path}. Run "
                "`python -m models.Risk_Prediction` from services/ml-api/ first."
            )
        artifact = joblib.load(model_path)
        self.model = artifact["model"]
        self.feature_order: List[str] = artifact["feature_order"]
        self.feature_baseline: np.ndarray = artifact["feature_baseline"]
        self.metrics = artifact.get("metrics", {})
        self._groups = self._build_groups()

    def predict(self, row: Dict) -> RiskPrediction:
        x = np.array(featurize(row), dtype=float)
        raw = float(self.model.predict(x.reshape(1, -1))[0])
        score = float(np.clip(raw, 0.0, 1.0))
        factors = self._contributing_factors(x, raw)
        return RiskPrediction(
            risk_score=score,
            risk_level=risk_level_from_score(score),
            contributing_factors=factors,
        )

    def _contributing_factors(self, x: np.ndarray, base_raw: float) -> List[str]:
        """
        For each feature group, swap its columns to the population mean and
        measure how much the (unclipped) prediction drops. Positive deltas
        mean the group is pushing this journey's score *above* the average.

        Uses raw predictions on both sides so a saturated high-risk score
        (raw > 1) still surfaces real contributors instead of zeroing out.
        """
        rows = []
        labels = []
        for group_name, idxs in self._groups:
            perturbed = x.copy()
            for i in idxs:
                perturbed[i] = self.feature_baseline[i]
            rows.append(perturbed)
            labels.append(self._label_for(group_name, idxs, x))

        preds = self.model.predict(np.vstack(rows))
        contributions = base_raw - preds

        ranked = sorted(
            zip(labels, contributions), key=lambda kv: kv[1], reverse=True
        )
        return [
            label
            for label, delta in ranked[:TOP_K_FACTORS]
            if delta >= FACTOR_MIN_CONTRIBUTION
        ]

    def _build_groups(self) -> List[Tuple[str, List[int]]]:
        """
        Returns a stable list of (group_name, column_indices). Numerics are
        single-column groups; one-hot blocks (journey_type, weather_condition,
        terrain_type) are grouped so we perturb the whole block at once.
        """
        groups: List[Tuple[str, List[int]]] = []
        onehot: Dict[str, List[int]] = {}
        for i, name in enumerate(self.feature_order):
            if "=" in name:
                group_name = name.split("=", 1)[0]
                onehot.setdefault(group_name, []).append(i)
            else:
                groups.append((name, [i]))
        for group_name, idxs in onehot.items():
            groups.append((group_name, idxs))
        return groups

    def _label_for(self, group_name: str, idxs: List[int], x: np.ndarray) -> str:
        if group_name in _NUMERIC_LABELS:
            return _NUMERIC_LABELS[group_name]
        # one-hot: surface the active value alongside the group noun
        noun = _GROUP_NOUN.get(group_name, group_name.replace("_", " "))
        for i in idxs:
            if x[i] >= 0.5:
                value = self.feature_order[i].split("=", 1)[1]
                return f"{value} {noun}"
        return noun


# Module-level singleton — loaded lazily by callers.
_predictor: Optional[RiskPredictor] = None


def get_predictor() -> RiskPredictor:
    global _predictor
    if _predictor is None:
        _predictor = RiskPredictor()
    return _predictor


if __name__ == "__main__":
    train()
