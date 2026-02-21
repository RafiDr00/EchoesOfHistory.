from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import hashlib
import logging
from app.services.history_service import HistoryService, MediaItem, TimelineEvent, RelatedArticle, BiographySection
from app.core.cache import cache

logger = logging.getLogger(__name__)
router = APIRouter()

class CinematicSearchRequest(BaseModel):
    q: str
    include_biography: bool = True
    include_media: bool = True
    include_timeline: bool = True
    include_related_articles: bool = True

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

def get_cache_key(query: str) -> str:
    return hashlib.md5(f"cinematic_v1_{query.lower()}".encode()).hexdigest()

def check_3d_model_availability(query: str) -> tuple[bool, Optional[str]]:
    famous_figures = ["napoleon", "cleopatra", "caesar", "einstein", "da vinci"]
    q_lower = query.lower()
    for figure in famous_figures:
        if figure in q_lower:
            return True, f"https://sketchfab.com/models/historical/{figure}/embed"
    return False, None

@router.post("/", response_model=CinematicSearchResponse)
async def cinematic_search(request: CinematicSearchRequest):
    """
    Enhanced cinematic search: Uses distributed Redis cache and centralized HistoryService.
    """
    start_time = datetime.now()
    cache_key = get_cache_key(request.q)
    
    cached = await cache.get(cache_key)
    if cached:
        logger.info(f"Cache hit for query: {request.q}")
        return cached

    try:
        # Fetching data using service layer
        summary_data = await HistoryService.fetch_wikipedia_summary(request.q)
        
        biography = None
        if summary_data and request.include_biography:
            biography = BiographySection(
                summary=summary_data.get("extract", ""),
                known_for=[summary_data.get("title", request.q)]
            )

        media = await HistoryService.fetch_media(request.q) if request.include_media else []
        timeline = await HistoryService.get_timeline(request.q) if request.include_timeline else []
        related = HistoryService.get_related_articles(request.q) if request.include_related_articles else []

        model_available, model_url = check_3d_model_availability(request.q)
        
        processing_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        response = CinematicSearchResponse(
            query=request.q,
            biography=biography,
            timeline=timeline,
            media=media,
            related_articles=related,
            model_3d_available=model_available,
            model_3d_url=model_url,
            processing_time_ms=processing_time,
            summary=biography.summary if biography else None
        )
        
        await cache.set(cache_key, response.dict(), ttl=86400)
        return response

    except Exception as e:
        logger.error(f"Error in cinematic_search for '{request.q}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process cinematic search")
