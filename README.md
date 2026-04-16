# WayPoint

WayPoint is a personal safety and journey-tracking project built as a small monorepo. The current prototype focuses on a mobile experience for planning safer routes, starting a journey, sharing progress with trusted contacts, and surfacing alerts if something goes off track.

## What is in this repo

- `apps/mobile` - Expo React Native app with the main product prototype
- `apps/web` - Next.js web app scaffold
- `services/core-api` - Express + Prisma API for user onboarding and persistence
- `services/ml-api` - FastAPI microservice for risk and duration predictions
- `packages/shared-types` - shared TypeScript package for cross-project types

## Current product flow

The mobile app currently includes:

- a splash screen and video-based auth landing screen
- a home screen with map preview, favorites, and alert access
- saved, popular, reviewed, and nearby route browsing
- a start-journey flow with route shape, distance or duration, journey mode, trusted contacts, and safety settings
- an active journey screen with timers, check-ins, route status, and contact status
- profile, alerts, statistics, and settings screens

The backend pieces are early-stage:

- `core-api` exposes a user onboarding endpoint at `POST /api/users/onboarding`
- `ml-api` exposes `POST /predict-risk` and `POST /predict-duration`
- the ML responses are currently placeholder values intended to unblock frontend and full-stack work
- the web app is still the default Next.js starter and has not been productized yet

## Tech stack

- Mobile: Expo, React Native, React Navigation, `react-native-maps`
- Web: Next.js 16, React 19
- Core API: Node.js, Express, TypeScript, Prisma, PostgreSQL
- ML API: FastAPI, Pydantic, TensorFlow, scikit-learn, pandas, numpy

## Project structure

```text
WayPoint/
├── apps/
│   ├── mobile/
│   └── web/
├── packages/
│   └── shared-types/
└── services/
    ├── core-api/
    └── ml-api/
```

## Getting started

### 1. Clone and install dependencies

This repo does not currently use a single workspace package manager at the root, so install dependencies inside each app or service.

Mobile:

```bash
cd apps/mobile
npm install
```

Web:

```bash
cd apps/web
npm install
```

Core API:

```bash
cd services/core-api
npm install
```

ML API:

```bash
cd services/ml-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment variables

`services/core-api` expects:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
PORT=3000
```

There is no committed `.env` template yet, so create one locally in `services/core-api/.env`.

## Running the apps

### Mobile app

```bash
cd apps/mobile
npm start
```

Useful Expo commands:

```bash
npm run android
npm run ios
npm run web
```

### Web app

```bash
cd apps/web
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Core API

```bash
cd services/core-api
npm run db:generate
npm run db:migrate:dev
npm run dev
```

The API will start on `http://localhost:3000` unless `PORT` is overridden.

### ML API

```bash
cd services/ml-api
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

The service will be available at `http://localhost:8000`.

## API overview

### Core API

`POST /api/users/onboarding`

Creates a user record with:

- `name`
- `email`
- `password`
- `phoneNumber` optional

### ML API

`POST /predict-risk`

Accepts a session and route context, then returns a risk score, risk level, and contributing factors.

`POST /predict-duration`

Accepts route distance and route metadata, then returns an estimated duration and confidence interval.

## Database

Prisma models currently cover:

- users
- trusted contacts
- journeys
- journey-contact relationships
- check-ins

The Prisma datasource is configured for PostgreSQL in `services/core-api/prisma/schema.prisma`.

## Notes and limitations

- The mobile app is the most complete part of the repo today.
- The web app is still scaffold-level.
- The ML service currently returns mock inference results.
- There is not yet a root workspace setup, shared scripts, or unified developer bootstrap command.
- Automated tests are not set up across the repo yet.

## Roadmap ideas

- connect the mobile flows to the core API and ML API
- replace placeholder ML predictions with trained model inference
- add authentication and session handling
- add a real route data source and live location updates
- turn the web app into a dashboard or marketing site
- add root-level workspace tooling and CI

## Contributing

If you are picking this project up for the first time, the easiest place to start is `apps/mobile`, since it currently shows the clearest version of the product direction. Happy building. ✨
