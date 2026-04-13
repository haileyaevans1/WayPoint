"""
Generate synthetic data for all 5 WayPoint tables.

Tables:
  1. Users
  2. TrustedContacts
  3. Journeys
  4. JourneyContacts
  5. CheckIns

Run:  python generate_fake_data.py
Out:  users.csv, trusted_contacts.csv, journeys.csv, journey_contacts.csv, check_ins.csv

Risk is generated from an engineered ground-truth function over features like
journey_type, is_solo, weather, terrain, elevation, time of day, and user
experience — so a model trained on this data recovers a real (if synthetic)
signal rather than random noise. Escalation status and check-in deviation
probabilities also scale with risk. In production, retrain on observed
escalation / incident outcomes instead.
"""

import os
import hashlib
import math
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

np.random.seed(42)
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Config ──────────────────────────────────────────────
NUM_USERS = 100
CONTACTS_PER_USER = (1, 5)     # each user has 1–5 trusted contacts
JOURNEYS_PER_USER = (0, 12)    # each user has 0–11 journeys
PINGS_PER_JOURNEY = (5, 30)    # GPS pings per active journey

JOURNEY_TYPES = ["walking", "running", "cycling", "hiking"]
JOURNEY_TYPE_BASE_RISK = {
    "walking": 0.05,
    "running": 0.10,
    "cycling": 0.15,
    "hiking":  0.30,
}

WEATHER_CONDITIONS = ["clear", "cloudy", "rain", "storm", "fog", "snow"]
WEATHER_WEIGHTS    = [0.45,    0.25,     0.12,   0.05,    0.08,  0.05]
WEATHER_RISK = {
    "clear":  0.00,
    "cloudy": 0.05,
    "rain":   0.20,
    "storm":  0.45,
    "fog":    0.25,
    "snow":   0.35,
}

TERRAIN_TYPES   = ["urban", "park", "trail", "remote"]
TERRAIN_WEIGHTS = [0.40,    0.30,   0.20,    0.10]
TERRAIN_RISK = {
    "urban":  0.05,
    "park":   0.00,
    "trail":  0.15,
    "remote": 0.40,
}
# Typical elevation gain (m) per terrain type
TERRAIN_ELEV_MEAN = {"urban": 10, "park": 40, "trail": 120, "remote": 250}

SOLO_PROB = 0.55   # P(journey is taken alone)
NIGHT_START, NIGHT_END = 20, 6  # hours treated as "night"

RELATIONSHIPS = ["spouse", "parent", "sibling", "friend", "partner", "roommate", None]

FIRST_NAMES = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Daniel", "Karen", "Matthew", "Lisa", "Anthony", "Nancy",
    "Mark", "Betty", "Donald", "Margaret", "Steven", "Sandra", "Andrew", "Ashley",
    "Paul", "Kimberly", "Joshua", "Emily", "Kenneth", "Donna", "Kevin", "Michelle",
    "Brian", "Carol", "George", "Amanda", "Timothy", "Melissa", "Ronald", "Deborah",
    "Edward", "Stephanie", "Jason", "Rebecca", "Jeffrey", "Sharon", "Ryan", "Laura",
    "Jacob", "Cynthia", "Gary", "Kathleen", "Nicholas", "Amy", "Eric", "Angela",
    "Jonathan", "Shirley", "Stephen", "Anna", "Larry", "Brenda", "Justin", "Pamela",
    "Scott", "Emma", "Brandon", "Nicole", "Benjamin", "Helen", "Samuel", "Samantha",
    "Raymond", "Katherine", "Gregory", "Christine", "Frank", "Debra", "Alexander", "Rachel",
    "Patrick", "Carolyn", "Jack", "Janet", "Dennis", "Catherine", "Jerry", "Maria",
    "Tyler", "Heather", "Aaron", "Diane",
]
LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts",
]
EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "hotmail.com"]

# Tulsa, OK metro area bounding box
LAT_RANGE = (35.95, 36.20)
LNG_RANGE = (-96.05, -95.80)

BASE_DATE = datetime(2025, 1, 1)

# Tulsa monthly mean temps (°F), for plausible temperature-by-season
SEASONAL_MEAN_F = {
    1: 42, 2: 47, 3: 55, 4: 64, 5: 72, 6: 81,
    7: 86, 8: 85, 9: 77, 10: 66, 11: 54, 12: 44,
}


# ── Helpers ─────────────────────────────────────────────
def fake_phone():
    return f"+1{np.random.randint(200,999)}{np.random.randint(1000000,9999999)}"


def fake_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def haversine_km(lat1, lng1, lat2, lng2):
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def compute_risk(f) -> float:
    """
    Ground-truth risk function: weighted linear combination of features + noise.
    A trained model should recover this mapping. Output clipped to [0, 1].
    """
    r  = JOURNEY_TYPE_BASE_RISK[f["journey_type"]]
    r += WEATHER_RISK[f["weather_condition"]]
    r += TERRAIN_RISK[f["terrain_type"]]
    r += 0.20 * int(f["is_solo"])
    r += 0.15 * int(f["is_night"])
    r += 0.10 * min(f["elevation_gain_m"] / 1000.0, 1.0)
    r += 0.08 * min(f["distance_km"] / 20.0, 1.0)

    # Temperature extremes add risk
    t = f["temperature_f"]
    if t < 32 or t > 95:
        r += 0.15
    elif t < 45 or t > 85:
        r += 0.05

    # Experience reduces risk (caps out around 20 prior journeys)
    r -= 0.15 * min(f["user_experience"] / 20.0, 1.0)

    # Gaussian noise so the function isn't perfectly recoverable
    r += np.random.normal(0, 0.07)
    return float(np.clip(r, 0.0, 1.0))


# ── 1. Users ────────────────────────────────────────────
print("Generating Users...")
users = []
used_emails = set()

for uid in range(1, NUM_USERS + 1):
    first = np.random.choice(FIRST_NAMES)
    last = np.random.choice(LAST_NAMES)
    name = f"{first} {last}"

    base_email = f"{first.lower()}.{last.lower()}"
    domain = np.random.choice(EMAIL_DOMAINS)
    email = f"{base_email}@{domain}"
    suffix = 1
    while email in used_emails:
        email = f"{base_email}{suffix}@{domain}"
        suffix += 1
    used_emails.add(email)

    created_at = BASE_DATE + timedelta(days=int(np.random.randint(0, 365)))

    users.append({
        "id": uid,
        "name": name,
        "email": email,
        "password_hash": fake_hash(f"password{uid}"),
        "phone_number": fake_phone(),
        "created_at": created_at.isoformat(),
    })

df_users = pd.DataFrame(users)
df_users.to_csv(os.path.join(OUT_DIR, "users.csv"), index=False)
print(f"  {len(df_users)} users")

# ── 2. TrustedContacts ──────────────────────────────────
print("Generating TrustedContacts...")
contacts = []
contact_id = 1

for user in users:
    n_contacts = np.random.randint(*CONTACTS_PER_USER)
    for _ in range(n_contacts):
        first = np.random.choice(FIRST_NAMES)
        last = np.random.choice(LAST_NAMES)
        contacts.append({
            "id": contact_id,
            "user_id": user["id"],
            "contact_name": f"{first} {last}",
            "phone_number": fake_phone(),
            "email": f"{first.lower()}.{last.lower()}@{np.random.choice(EMAIL_DOMAINS)}",
            "relationship": np.random.choice(RELATIONSHIPS),
        })
        contact_id += 1

df_contacts = pd.DataFrame(contacts)
df_contacts.to_csv(os.path.join(OUT_DIR, "trusted_contacts.csv"), index=False)
print(f"  {len(df_contacts)} contacts across {NUM_USERS} users")

# ── 3. Journeys ─────────────────────────────────────────
print("Generating Journeys...")
journeys = []
journey_id = 1

for user in users:
    n_journeys = np.random.randint(*JOURNEYS_PER_USER)
    user_created = datetime.fromisoformat(user["created_at"])

    # First pass: generate feature params for each of this user's journeys
    raw = []
    for _ in range(n_journeys):
        jtype   = np.random.choice(JOURNEY_TYPES)
        weather = np.random.choice(WEATHER_CONDITIONS, p=WEATHER_WEIGHTS)
        terrain = np.random.choice(TERRAIN_TYPES, p=TERRAIN_WEIGHTS)
        is_solo = bool(np.random.random() < SOLO_PROB)

        started_at = user_created + timedelta(
            days=int(np.random.randint(0, 200)),
            hours=int(np.random.randint(0, 24)),
            minutes=int(np.random.randint(0, 60)),
        )
        hour = started_at.hour
        is_night = hour >= NIGHT_START or hour < NIGHT_END

        temp_mean = SEASONAL_MEAN_F[started_at.month]
        if is_night:
            temp_mean -= 10  # nights are cooler
        temperature_f = round(float(np.random.normal(temp_mean, 8)), 1)

        expected_dur = int(np.random.randint(10, 180))

        origin_lat = round(np.random.uniform(*LAT_RANGE), 6)
        origin_lng = round(np.random.uniform(*LNG_RANGE), 6)
        dest_lat   = round(origin_lat + np.random.uniform(-0.04, 0.04), 6)
        dest_lng   = round(origin_lng + np.random.uniform(-0.04, 0.04), 6)
        distance_km = round(haversine_km(origin_lat, origin_lng, dest_lat, dest_lng), 3)

        elev_mean = TERRAIN_ELEV_MEAN[terrain]
        elevation_gain_m = round(max(0.0, float(np.random.normal(elev_mean, elev_mean * 0.4))), 1)

        mid_lat = round((origin_lat + dest_lat) / 2 + np.random.uniform(-0.005, 0.005), 6)
        mid_lng = round((origin_lng + dest_lng) / 2 + np.random.uniform(-0.005, 0.005), 6)
        planned_polyline = f"{origin_lat},{origin_lng};{mid_lat},{mid_lng};{dest_lat},{dest_lng}"

        raw.append({
            "journey_type": jtype,
            "weather_condition": weather,
            "terrain_type": terrain,
            "is_solo": is_solo,
            "is_night": is_night,
            "temperature_f": temperature_f,
            "elevation_gain_m": elevation_gain_m,
            "distance_km": distance_km,
            "expected_duration_minutes": expected_dur,
            "origin_lat": origin_lat,
            "origin_lng": origin_lng,
            "destination_lat": dest_lat,
            "destination_lng": dest_lng,
            "planned_polyline": planned_polyline,
            "started_at": started_at,
        })

    # Sort chronologically so user_experience = count of prior journeys
    raw.sort(key=lambda j: j["started_at"])

    for idx, p in enumerate(raw):
        user_experience = idx  # prior journeys for this user at time of this one

        risk_score = compute_risk({**p, "user_experience": user_experience})
        risk_level = "high" if risk_score >= 0.65 else ("medium" if risk_score >= 0.35 else "low")

        # Status: escalation probability scales with risk
        p_escalate = 0.02 + 0.35 * risk_score   # ≈ 2% at low risk, ≈ 37% at max risk
        roll = np.random.random()
        if roll < p_escalate:
            status = "escalated"
        else:
            roll2 = np.random.random()
            if roll2 < 0.10:
                status = "cancelled"
            elif roll2 < 0.18:
                status = "active"
            else:
                status = "completed"

        started_at = p["started_at"]
        if status == "completed":
            actual_dur = p["expected_duration_minutes"] + int(np.random.randint(-15, 30))
            completed_at = started_at + timedelta(minutes=max(actual_dur, 5))
        elif status == "escalated":
            actual_dur = p["expected_duration_minutes"] + int(np.random.randint(15, 90))
            completed_at = started_at + timedelta(minutes=actual_dur)
        else:
            completed_at = None

        journeys.append({
            "id": journey_id,
            "user_id": user["id"],
            "planned_polyline": p["planned_polyline"],
            "origin_lat": p["origin_lat"],
            "origin_lng": p["origin_lng"],
            "destination_lat": p["destination_lat"],
            "destination_lng": p["destination_lng"],
            "journey_type": p["journey_type"],
            "distance_km": p["distance_km"],
            "expected_duration_minutes": p["expected_duration_minutes"],
            "elevation_gain_m": p["elevation_gain_m"],
            "terrain_type": p["terrain_type"],
            "weather_condition": p["weather_condition"],
            "temperature_f": p["temperature_f"],
            "is_solo": p["is_solo"],
            "is_night": p["is_night"],
            "risk_score": round(risk_score, 4),
            "risk_level": risk_level,
            "status": status,
            "started_at": started_at.isoformat(),
            "completed_at": completed_at.isoformat() if completed_at else None,
            "created_at": started_at.isoformat(),
        })
        journey_id += 1

df_journeys = pd.DataFrame(journeys)
df_journeys.to_csv(os.path.join(OUT_DIR, "journeys.csv"), index=False)
print(f"  {len(df_journeys)} journeys")
print(f"    Status:\n{df_journeys['status'].value_counts().to_string()}")
print(f"    Risk level:\n{df_journeys['risk_level'].value_counts().to_string()}")
print(f"    Mean risk_score: {df_journeys['risk_score'].mean():.3f}")

# ── 4. JourneyContacts ──────────────────────────────────
print("Generating JourneyContacts...")
journey_contacts = []
jc_id = 1

contacts_by_user = df_contacts.groupby("user_id")["id"].apply(list).to_dict()

for journey in journeys:
    # Solo journeys have no assigned contacts — keeps is_solo consistent
    if journey["is_solo"]:
        continue

    uid = journey["user_id"]
    user_contacts = contacts_by_user.get(uid, [])
    if not user_contacts:
        continue

    n_assign = np.random.randint(1, len(user_contacts) + 1)
    assigned = np.random.choice(user_contacts, size=n_assign, replace=False)

    for cid in assigned:
        journey_contacts.append({
            "id": jc_id,
            "journey_id": journey["id"],
            "trusted_contact_id": int(cid),
        })
        jc_id += 1

df_jc = pd.DataFrame(journey_contacts)
df_jc.to_csv(os.path.join(OUT_DIR, "journey_contacts.csv"), index=False)
print(f"  {len(df_jc)} journey-contact assignments")

# ── 5. CheckIns ─────────────────────────────────────────
print("Generating CheckIns...")
checkins = []
checkin_id = 1

for journey in journeys:
    if journey["status"] == "cancelled":
        continue

    n_pings = np.random.randint(*PINGS_PER_JOURNEY)
    start = datetime.fromisoformat(journey["started_at"])
    origin_lat = journey["origin_lat"]
    origin_lng = journey["origin_lng"]
    dest_lat   = journey["destination_lat"]
    dest_lng   = journey["destination_lng"]

    # Deviation probability scales with status + risk
    if journey["status"] == "escalated":
        has_deviation = True
    else:
        p_dev = 0.05 + 0.45 * journey["risk_score"]  # ≈ 5% low risk, ≈ 50% high risk
        has_deviation = np.random.random() < p_dev

    deviation_start = np.random.randint(n_pings // 3, n_pings) if has_deviation else n_pings + 1

    for ping in range(n_pings):
        t = ping / max(n_pings - 1, 1)
        lat = origin_lat + (dest_lat - origin_lat) * t
        lng = origin_lng + (dest_lng - origin_lng) * t

        if ping >= deviation_start:
            drift = (ping - deviation_start + 1) * 0.0004
            lat += np.random.normal(0, drift)
            lng += np.random.normal(0, drift)
            deviation_flag = True
        else:
            lat += np.random.normal(0, 0.00012)
            lng += np.random.normal(0, 0.00012)
            deviation_flag = False

        timestamp = start + timedelta(seconds=ping * 30)

        checkins.append({
            "id": checkin_id,
            "journey_id": journey["id"],
            "latitude": round(lat, 6),
            "longitude": round(lng, 6),
            "timestamp": timestamp.isoformat(),
            "deviation_flag": deviation_flag,
        })
        checkin_id += 1

df_checkins = pd.DataFrame(checkins)
df_checkins.to_csv(os.path.join(OUT_DIR, "check_ins.csv"), index=False)
deviated_count = int(df_checkins["deviation_flag"].sum())
print(f"  {len(df_checkins)} check-in pings ({deviated_count} deviated, {deviated_count/len(df_checkins):.1%})")

# ── Summary ─────────────────────────────────────────────
print("\nAll CSVs written to:", OUT_DIR)
print(f"  users.csv              {len(df_users)} rows")
print(f"  trusted_contacts.csv   {len(df_contacts)} rows")
print(f"  journeys.csv           {len(df_journeys)} rows")
print(f"  journey_contacts.csv   {len(df_jc)} rows")
print(f"  check_ins.csv          {len(df_checkins)} rows")
