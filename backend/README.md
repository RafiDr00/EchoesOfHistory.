# 🏛️ Echoes of History - Backend API

The backend API for Echoes of History, built with FastAPI and SQLModel.

## 🚀 Features

- **FastAPI Framework**: High-performance async web framework
- **SQLModel Integration**: Type-safe database operations with SQLite
- **JWT Authentication**: Secure token-based authentication
- **OpenAI Integration**: AI-powered historical conversations (optional)
- **Wikipedia API**: Real-time historical data fetching
- **Enhanced Search**: Multi-source search with caching
- **CORS Support**: Configured for frontend integration

## 📊 API Documentation

Once the server is running, visit:
- **Interactive Docs**: http://127.0.0.1:8080/docs
- **OpenAPI Schema**: http://127.0.0.1:8080/openapi.json

## 🔧 Setup

### Install Dependencies
```bash
pip install -r requirements.txt
```

### Environment Configuration
Create a `.env` file:
```env
DATABASE_URL=sqlite+aiosqlite:///./echoes.db
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key-here  # Optional
FRONTEND_URL=http://localhost:3000
```

### Run the Server
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8080
```
