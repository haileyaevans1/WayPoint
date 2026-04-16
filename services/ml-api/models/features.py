"""
Shared feature definitions for the risk model.

Training (train.py) and inference (risk_model.py) both import from here so the
feature order, categorical vocabularies, and risk bucketing stay aligned.
"""

from __future__ import annotations

import math
from typing import Dict, List

JOURNEY_TYPES = ["walking", "running", "cycling", "hiking"]
WEATHER_CONDITIONS = ["clear", "cloudy", "rain", "storm", "fog", "snow"]
TERRAIN_TYPES = ["urban", "park", "trail", "remote"]

NUMERIC_FEATURES = [
    "is_solo",
    "is_night",
    "temperature_f",
    "elevation_gain_m",
    "distance_km",
    "user_experience",
]

# Full feature vector order: numerics first, then one-hot groups.
FEATURE_ORDER: List[str] = (
    NUMERIC_FEATURES
    + [f"journey_type={v}" for v in JOURNEY_TYPES]
    + [f"weather_condition={v}" for v in WEATHER_CONDITIONS]
    + [f"terrain_type={v}" for v in TERRAIN_TYPES]
)

# Matches the thresholds used when generating synthetic data.
RISK_LEVEL_HIGH = 0.65
RISK_LEVEL_MEDIUM = 0.35


def risk_level_from_score(score: float) -> str:
    if score >= RISK_LEVEL_HIGH:
        return "high"
    if score >= RISK_LEVEL_MEDIUM:
        return "medium"
    return "low"


def featurize(row: Dict) -> List[float]:
    """
    Turn a dict of raw fields into a feature vector in FEATURE_ORDER.

    Expected keys: journey_type, weather_condition, terrain_type, is_solo,
    is_night, temperature_f, elevation_gain_m, distance_km, user_experience.
    Unknown categorical values become an all-zero one-hot group, so the model
    falls back to the learned intercept / other features.
    """
    vec: List[float] = [
        float(bool(row["is_solo"])),
        float(bool(row["is_night"])),
        float(row["temperature_f"]),
        float(row["elevation_gain_m"]),
        float(row["distance_km"]),
        float(row["user_experience"]),
    ]
    for v in JOURNEY_TYPES:
        vec.append(1.0 if row.get("journey_type") == v else 0.0)
    for v in WEATHER_CONDITIONS:
        vec.append(1.0 if row.get("weather_condition") == v else 0.0)
    for v in TERRAIN_TYPES:
        vec.append(1.0 if row.get("terrain_type") == v else 0.0)
    return vec


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))
