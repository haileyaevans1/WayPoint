from pydantic import BaseModel
from typing import List, Optional

# Shared sub-structures


class Location(BaseModel):
    lat: float
    lng: float

# --- Risk Scoring Schemas ---


class RiskRequest(BaseModel):
    session_id: str
    start_time: str
    route_type: str
    estimated_duration_mins: int
    start_location: Location
    end_location: Location


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
