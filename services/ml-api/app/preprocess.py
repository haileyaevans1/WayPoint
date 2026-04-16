"""
Maps a RiskRequest into the feature dict expected by the trained model.

Anything we can compute from the request (distance from coords, is_night from
start_time) is computed here. Anything the caller didn't supply falls back to
the most-common bucket in the training data — see RiskRequest defaults and the
constants below.
"""

from __future__ import annotations

from datetime import datetime
from typing import Dict

from app.schemas import RiskRequest
from models.features import (
    JOURNEY_TYPES,
    TERRAIN_TYPES,
    WEATHER_CONDITIONS,
    haversine_km,
)

# Mode of each categorical in the synthetic data — used when the caller omits
# the field rather than leaving the one-hot block all-zero.
DEFAULT_WEATHER = "clear"
DEFAULT_TERRAIN = "urban"
DEFAULT_TEMPERATURE_F = 65.0
DEFAULT_ELEVATION_GAIN_M = 30.0

NIGHT_START_HOUR = 20
NIGHT_END_HOUR = 6


def _is_night(start_time: str) -> bool:
    try:
        hour = datetime.fromisoformat(start_time.replace("Z", "+00:00")).hour
    except ValueError:
        return False
    return hour >= NIGHT_START_HOUR or hour < NIGHT_END_HOUR


def _validated(value: str | None, allowed: list, default: str) -> str:
    return value if value in allowed else default


def request_to_features(req: RiskRequest) -> Dict:
    distance_km = haversine_km(
        req.start_location.lat,
        req.start_location.lng,
        req.end_location.lat,
        req.end_location.lng,
    )

    return {
        "journey_type": _validated(req.route_type, JOURNEY_TYPES, JOURNEY_TYPES[0]),
        "weather_condition": _validated(
            req.weather_condition, WEATHER_CONDITIONS, DEFAULT_WEATHER
        ),
        "terrain_type": _validated(req.terrain_type, TERRAIN_TYPES, DEFAULT_TERRAIN),
        "is_solo": bool(req.is_solo) if req.is_solo is not None else True,
        "is_night": _is_night(req.start_time),
        "temperature_f": (
            req.temperature_f if req.temperature_f is not None else DEFAULT_TEMPERATURE_F
        ),
        "elevation_gain_m": (
            req.elevation_gain_m
            if req.elevation_gain_m is not None
            else DEFAULT_ELEVATION_GAIN_M
        ),
        "distance_km": distance_km,
        "user_experience": int(req.user_experience or 0),
    }
