# Echoes of History

An AI-powered historical exploration platform. Search historical figures and events, chat with AI representations of historical personalities, and navigate an interactive timeline — all backed by Wikipedia and OpenAI.

## Features

- **Cinematic Search** — AI-enriched search with Wikipedia media, quotes, and related topics
- **Historical Chat** — Converse with GPT-4-powered representations of historical figures
- **Interactive Timeline** — D3.js-powered navigable timeline of human history
- **3D Globe** — WebGL globe with 12 mapped historical sites, draggable and interactive
- **Auth** — JWT authentication with user profiles and search history

## Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, FastAPI, SQLModel |
| **Database** | SQLite (dev) / PostgreSQL (prod) via Alembic |
| **AI** | OpenAI GPT-4o — historical conversations + AI insights |
| **Data** | Wikipedia REST API + Wikimedia Commons |
| **Frontend** | Next.js 14, Tailwind CSS, Framer Motion |
| **3D** | Three.js (WebGL globe, particle field) |
| **Visualisation** | D3.js interactive timeline |

## Quick Start

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add OPENAI_API_KEY
uvicorn app.main:app --reload --port 8080

# Frontend
cd frontend
cp .env.example .env.local
npm install
npm run dev            # → http://localhost:3000
```

**Docker:**
```bash
docker compose up --build
```

## Configuration

`backend/.env`:
```
DATABASE_URL=sqlite+aiosqlite:///./echoes.db
JWT_SECRET=change-this-in-production
OPENAI_API_KEY=sk-...          # optional — enables AI chat
FRONTEND_URL=http://localhost:3000
```

`frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## API

```
POST /api/v1/auth/register       Register user
POST /api/v1/auth/login          Login
GET  /api/v1/auth/me             Current user

POST /api/v1/search/enhanced     Rich search with media
POST /api/v1/search/query        Wikipedia search + DB cache
GET  /api/v1/search/timeline/:topic  Timeline data
POST /api/v1/search/ai-insights  GPT-4 historical analysis

POST /api/v1/chat/talk           Chat with historical figure

GET  /healthz                    Health check
```
