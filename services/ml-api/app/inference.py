"""
Thin adapter between FastAPI handlers and the trained risk model.
"""

from __future__ import annotations

from app.preprocess import request_to_features
from app.schemas import RiskRequest, RiskResponse
from models.Risk_Prediction import get_predictor


def predict_risk(request: RiskRequest) -> RiskResponse:
    features = request_to_features(request)
    result = get_predictor().predict(features)
    return RiskResponse(
        session_id=request.session_id,
        risk_score_raw=round(result.risk_score, 4),
        risk_level=result.risk_level,
        contributing_factors=result.contributing_factors,
    )
