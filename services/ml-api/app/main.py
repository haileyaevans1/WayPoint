from fastapi import FastAPI

from app.inference import predict_risk
from app.schemas import DurationRequest, DurationResponse, RiskRequest, RiskResponse

app = FastAPI(
    title="WayPoint ML API",
    description="Machine Learning Microservice for the WayPoint Safety App",
    version="1.0.0",
)


@app.get("/")
def read_root():
    return {"message": "WayPoint ML Microservice is active and listening!"}


@app.post("/predict-risk", response_model=RiskResponse)
def predict_risk_endpoint(request: RiskRequest) -> RiskResponse:
    return predict_risk(request)


@app.post("/predict-duration", response_model=DurationResponse)
def predict_duration(request: DurationRequest):
    # TODO: Replace with trained duration model.
    estimated_duration = request.route_distance_meters // 80
    return DurationResponse(
        predicted_duration_mins=estimated_duration,
        confidence_interval_mins=5,
    )
