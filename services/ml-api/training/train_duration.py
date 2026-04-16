import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import os

# Load data
data_path = os.path.join(os.path.dirname(__file__), '../data/journeys.csv')
df = pd.read_csv(data_path)

# Feature Selection
numeric_features = ['distance_km', 'elevation_gain_m', 'temperature_f']
categorical_features = ['journey_type', 'weather_condition', 'terrain_type']

X = df[numeric_features + categorical_features]
y = df['expected_duration_minutes']

# Preprocessing: Scale numbers and One-Hot Encode categories
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(), categorical_features)
    ]
)

X_processed = preprocessor.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_processed, y, test_size=0.2, random_state=42)

# Build the Neural Network
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dense(32, activation='relu'),
    Dense(1)    # Predicts duration in minutes
])

model.compile(optimizer='adam', loss='mae')
print("Training Duration Model on WayPoint Journey Data...")
model.fit(X_train, y_train, epochs=30, verbose=1)

# Save to designated models folder
save_dir = os.path.join(os.path.dirname(__file__), '../models')
os.makedirs(save_dir, exist_ok=True)

model.save(f"{save_dir}/duration_predictor.keras")
joblib.dump(preprocessor, f"{save_dir}/preprocessor.joblib")

print(f"Success! Model and Preprocessor saved to {save_dir}")