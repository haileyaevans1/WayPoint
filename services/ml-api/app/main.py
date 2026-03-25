from fastapi import FastAPI
from app.schemas import RiskRequest, RiskResponse, DurationRequest, DurationResponse

# Initialize the FastAPI application
app = FastAPI(
    title="WayPoint ML API",
    description="Machine Learning Microservice for the WayPoint Safety App",
    version="1.0.0"
)

# A simple health check endpoint


@app.get("/")
def read_root():
    return {"message": "WayPoint ML Microservice is active and listening!"}

# Endpoint 1: Predict Risk


@app.post("/predict-risk", response_model=RiskResponse)
def predict_risk(request: RiskRequest):
    # TODO: Replace this with actual TensorFlow model inference

    # Returning a dummy response for Full-Stack team
    return RiskResponse(
        session_id=request.session_id,
        risk_score_raw=0.82,
        risk_level="high",
        contributing_factors=["nighttime", "isolated-path"]
    )

# Endpoint 2: Predict Duration


@app.post("/predict-duration", response_model=DurationResponse)
def predict_duration(request: DurationRequest):
    # TODO: Replace this with actual TensorFlow model inference

    # Dummy calculation: let's say they walk 80 meters per minute.
    estimated_duration = request.route_distance_meters // 80

    return DurationResponse(
        predicted_duration_mins=estimated_duration,
        confidence_interval_mins=5
    )
