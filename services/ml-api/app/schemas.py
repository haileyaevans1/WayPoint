from pydantic import BaseModel
from typing import List, Optional

# Shared sub-structures


class Location(BaseModel):
    lat: float
    lng: float

# --- Risk Scoring Schemas ---


class RiskRequest(BaseModel):
    session_id: str
    start_time: str  # ISO 8601 — used to derive is_night
    route_type: str  # walking | running | cycling | hiking
    estimated_duration_mins: int
    start_location: Location
    end_location: Location

    # Optional environment / journey signals. Defaults match the most-common
    # bucket in the synthetic data so missing fields degrade gracefully.
    weather_condition: Optional[str] = None       # clear|cloudy|rain|storm|fog|snow
    terrain_type: Optional[str] = None            # urban|park|trail|remote
    is_solo: Optional[bool] = True
    temperature_f: Optional[float] = None
    elevation_gain_m: Optional[float] = None
    user_experience: Optional[int] = 0            # # of prior journeys


class RiskResponse(BaseModel):
    session_id: str
    risk_score_raw: float
    risk_level: str
    contributing_factors: List[str]

# --- Duration Prediction Schemas ---


class DurationRequest(BaseModel):
    route_distance_meters: int
    route_type: str
    elevation_gain_meters: Optional[float] = 0.0


class DurationResponse(BaseModel):
    predicted_duration_mins: int
    confidence_interval_mins: int
