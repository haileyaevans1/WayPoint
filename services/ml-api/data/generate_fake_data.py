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

These CSVs mirror the DB schema exactly — swap CSV reads for DB queries later.
"""

import os
import hashlib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

np.random.seed(42)
OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Config ──────────────────────────────────────────────
NUM_USERS = 100
CONTACTS_PER_USER = (1, 5)     # each user has 1–5 trusted contacts
JOURNEYS_PER_USER = (0, 12)    # each user has 0–12 journeys
PINGS_PER_JOURNEY = (5, 30)    # GPS pings per active journey

JOURNEY_TYPES = ["walking", "running", "cycling", "hiking"]
STATUSES = ["active", "completed", "cancelled", "escalated"]
STATUS_WEIGHTS = [0.10, 0.65, 0.10, 0.15]
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


def fake_phone():
    return f"+1{np.random.randint(200,999)}{np.random.randint(1000000,9999999)}"


def fake_hash(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


# ── 1. Users ────────────────────────────────────────────
print("Generating Users...")
users = []
used_emails = set()

for uid in range(1, NUM_USERS + 1):
    first = np.random.choice(FIRST_NAMES)
    last = np.random.choice(LAST_NAMES)
    name = f"{first} {last}"

    # ensure unique email
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

    for _ in range(n_journeys):
        jtype = np.random.choice(JOURNEY_TYPES)
        status = np.random.choice(STATUSES, p=STATUS_WEIGHTS)
        expected_dur = int(np.random.randint(10, 180))

        origin_lat = round(np.random.uniform(*LAT_RANGE), 6)
        origin_lng = round(np.random.uniform(*LNG_RANGE), 6)
        dest_lat = round(origin_lat + np.random.uniform(-0.04, 0.04), 6)
        dest_lng = round(origin_lng + np.random.uniform(-0.04, 0.04), 6)

        # Build a simple polyline (origin → midpoint → destination)
        mid_lat = round((origin_lat + dest_lat) / 2 + np.random.uniform(-0.005, 0.005), 6)
        mid_lng = round((origin_lng + dest_lng) / 2 + np.random.uniform(-0.005, 0.005), 6)
        planned_polyline = f"{origin_lat},{origin_lng};{mid_lat},{mid_lng};{dest_lat},{dest_lng}"

        # Risk score — placeholder; ML model will overwrite these
        risk_score = round(np.random.uniform(0.0, 1.0), 4)
        risk_level = "high" if risk_score >= 0.65 else ("medium" if risk_score >= 0.35 else "low")

        started_at = user_created + timedelta(
            days=int(np.random.randint(0, 200)),
            hours=int(np.random.randint(5, 23)),
            minutes=int(np.random.randint(0, 60)),
        )

        if status == "completed":
            actual_dur = expected_dur + int(np.random.randint(-15, 30))
            completed_at = started_at + timedelta(minutes=max(actual_dur, 5))
        else:
            completed_at = None

        journeys.append({
            "id": journey_id,
            "user_id": user["id"],
            "planned_polyline": planned_polyline,
            "origin_lat": origin_lat,
            "origin_lng": origin_lng,
            "destination_lat": dest_lat,
            "destination_lng": dest_lng,
            "journey_type": jtype,
            "expected_duration_minutes": expected_dur,
            "risk_score": risk_score,
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
print(f"    Status distribution:\n{df_journeys['status'].value_counts().to_string()}")

# ── 4. JourneyContacts ──────────────────────────────────
print("Generating JourneyContacts...")
journey_contacts = []
jc_id = 1

# Build a lookup of contacts per user
contacts_by_user = df_contacts.groupby("user_id")["id"].apply(list).to_dict()

for journey in journeys:
    uid = journey["user_id"]
    user_contacts = contacts_by_user.get(uid, [])
    if not user_contacts:
        continue

    # Assign 1 to all contacts for this journey
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
    dest_lat = journey["destination_lat"]
    dest_lng = journey["destination_lng"]

    # Decide if this journey has a deviation event (~20% of journeys)
    has_deviation = np.random.random() < 0.20
    deviation_start = np.random.randint(n_pings // 3, n_pings) if has_deviation else n_pings + 1

    for ping in range(n_pings):
        t = ping / max(n_pings - 1, 1)  # 0.0 → 1.0 progress

        # Interpolate along route + slight noise
        lat = origin_lat + (dest_lat - origin_lat) * t
        lng = origin_lng + (dest_lng - origin_lng) * t

        if ping >= deviation_start:
            # Progressive drift
            drift = (ping - deviation_start + 1) * 0.0004
            lat += np.random.normal(0, drift)
            lng += np.random.normal(0, drift)
            deviation_flag = True
        else:
            # Normal GPS jitter
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
deviated_count = df_checkins["deviation_flag"].sum()
print(f"  {len(df_checkins)} check-in pings ({deviated_count} deviated, {deviated_count/len(df_checkins):.1%})")

# ── Summary ─────────────────────────────────────────────
print("\nAll CSVs written to:", OUT_DIR)
print(f"  users.csv              {len(df_users)} rows")
print(f"  trusted_contacts.csv   {len(df_contacts)} rows")
print(f"  journeys.csv           {len(df_journeys)} rows")
print(f"  journey_contacts.csv   {len(df_jc)} rows")
print(f"  check_ins.csv          {len(df_checkins)} rows")
