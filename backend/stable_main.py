from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.db import init_db
import os
from dotenv import load_dotenv
import threading
import time

# Load environment variables
load_dotenv()

app = FastAPI(title="Echoes of History - API")

# Global flag to track initialization
_db_initialized = False

@app.middleware("http")
async def catch_exceptions(request: Request, call_next):
    try:
        print(f"Received request: {request.method} {request.url.path}")
        response = await call_next(request)
        print(f"Sending response: {response.status_code}")
        return response
    except Exception as e:
        print(f"Unhandled exception: {e}")
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})

@app.on_event("startup")
async def startup_event():
    global _db_initialized
    if not _db_initialized:
        print("Starting database initialization...")
        try:
            await init_db()
            print("Database initialization completed successfully")
            _db_initialized = True
        except Exception as e:
            print(f"Database initialization failed: {e}")
            import traceback
            traceback.print_exc()

# Add CORS middleware
frontend_urls = os.getenv("FRONTEND_URL", "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
async def healthz():
    print("Health endpoint called successfully")
    return {"status": "ok", "message": "Server is running", "db_initialized": _db_initialized}

# Add cinematic search endpoint directly here to avoid import issues
from pydantic import BaseModel
from typing import Optional, List
import httpx
import asyncio
from datetime import datetime

class CinematicSearchRequest(BaseModel):
    q: str
    include_biography: bool = True
    include_media: bool = True
    include_timeline: bool = True
    include_related_articles: bool = True

class BiographySection(BaseModel):
    summary: str
    known_for: List[str] = []

class TimelineEvent(BaseModel):
    year: int
    title: str
    description: str
    importance: int = 5

class MediaItem(BaseModel):
    url: str
    title: str
    description: Optional[str] = None
    type: str = "image"
    source: str = "wikipedia"
    credit: Optional[str] = None

class RelatedArticle(BaseModel):
    title: str
    url: str
    description: str
    category: str
    icon: str = "📚"

class CinematicSearchResponse(BaseModel):
    query: str
    biography: Optional[BiographySection] = None
    timeline: List[TimelineEvent] = []
    media: List[MediaItem] = []
    related_articles: List[RelatedArticle] = []
    model_3d_available: bool = False
    model_3d_url: Optional[str] = None
    processing_time_ms: int
    summary: Optional[str] = None

@app.post("/api/cinematic", response_model=CinematicSearchResponse)
async def cinematic_search(request: CinematicSearchRequest):
    """Enhanced cinematic search with rich media"""
    start_time = datetime.now()
    print(f"Cinematic search request for: {request.q}")
    
    try:
        # Create mock data for now to test the endpoint
        biography = BiographySection(
            summary=f"{request.q} was a significant historical figure known for their contributions to history.",
            known_for=[f"Historical significance", "Cultural impact"]
        )
        
        timeline = [
            TimelineEvent(year=1800, title="Early Life", description=f"Birth and early years of {request.q}", importance=8),
            TimelineEvent(year=1850, title="Major Achievement", description=f"Significant accomplishment by {request.q}", importance=10),
        ]
        
        media = [
            MediaItem(
                url="https://via.placeholder.com/400x300",
                title=f"Portrait of {request.q}",
                description="Historical portrait",
                type="image",
                source="placeholder"
            )
        ]
        
        related_articles = [
            RelatedArticle(
                title=f"{request.q} Biography",
                url=f"https://en.wikipedia.org/wiki/{request.q.replace(' ', '_')}",
                description=f"Complete biography of {request.q}",
                category="biography",
                icon="📚"
            )
        ]
        
        processing_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        response = CinematicSearchResponse(
            query=request.q,
            biography=biography,
            timeline=timeline,
            media=media,
            related_articles=related_articles,
            model_3d_available=False,
            model_3d_url=None,
            processing_time_ms=processing_time,
            summary=biography.summary
        )
        
        print(f"Cinematic search completed in {processing_time}ms")
        return response
        
    except Exception as e:
        print(f"Cinematic search error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Enhanced search failed")

if __name__ == "__main__":
    import uvicorn
    print("Starting Echoes of History API server...")
    uvicorn.run(app, host="127.0.0.1", port=8085, log_level="info")
