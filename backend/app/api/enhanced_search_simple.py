from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import asyncio
import hashlib
import logging
from typing import List, Optional
from datetime import datetime
from app.services.history_service import HistoryService, MediaItem, get_http_client
from app.core.cache import cache

logger = logging.getLogger(__name__)
router = APIRouter()

class SearchRequest(BaseModel):
    q: str

class EnhancedSearchRequest(BaseModel):
    q: str
    include_images: bool = True
    include_quotes: bool = True
    max_results: int = 10

class SearchSuggestion(BaseModel):
    title: str
    snippet: str
    image: Optional[str] = None

class SearchImage(BaseModel):
    url: str
    title: str
    description: Optional[str] = None

class EnhancedSearchResponse(BaseModel):
    query: str
    results: List[dict]
    images: List[SearchImage]
    quotes: List[dict]
    related_topics: List[str]
    summary: Optional[str] = None

def get_cache_key(query: str) -> str:
    return hashlib.md5(f"enhanced_v1_{query.lower()}".encode()).hexdigest()

@router.get("/suggestions")
async def get_search_suggestions(q: str):
    """
    Get live search suggestions.
    Optimized for high-concurrency via connection pooling.
    """
    if not q: return {"suggestions": []}
    try:
        data = await HistoryService.fetch_wikipedia_summary(q)
        if data:
            suggestions = [SearchSuggestion(
                title=data.get("title", q),
                snippet=data.get("extract", "")[:200] + "...",
                image=data.get("thumbnail", {}).get("source")
            )]
            return {"suggestions": suggestions}
    except Exception as e:
        logger.error(f"Suggestions error for '{q}': {e}")
    return {"suggestions": []}

@router.post("/enhanced", response_model=EnhancedSearchResponse)
async def enhanced_search(request: EnhancedSearchRequest):
    """
    Elite-grade enhanced search:
    - Distributed Redis caching
    - Parallel async I/O via pooled HTTP client
    - Context-aware related topics
    """
    cache_key = get_cache_key(request.q)
    cached = await cache.get(cache_key)
    if cached:
        logger.info(f"Cache hit for enhanced query: {request.q}")
        return cached

    try:
        client = await get_http_client()
        wiki_task = HistoryService.fetch_wikipedia_summary(request.q)
        
        search_url = "https://en.wikipedia.org/w/api.php"
        search_params = {
            "action": "query",
            "format": "json",
            "list": "search",
            "srsearch": request.q,
            "srlimit": request.max_results
        }
        
        # Parallel execution using pooled client
        results_resp, wikipedia_data = await asyncio.gather(
            client.get(search_url, params=search_params),
            wiki_task
        )
        
        search_data = results_resp.json()
        results = []
        if "query" in search_data and "search" in search_data["query"]:
            for item in search_data["query"]["search"]:
                results.append({
                    "title": item["title"],
                    "snippet": item["snippet"],
                    "url": f"https://en.wikipedia.org/wiki/{item['title'].replace(' ', '_')}"
                })

        images = []
        if request.include_images:
            media_items = await HistoryService.fetch_media(request.q, limit=6)
            images = [SearchImage(url=m.url, title=m.title, description=m.description) for m in media_items]

        quotes = []
        if request.include_quotes:
            q_lower = request.q.lower()
            if "napoleon" in q_lower:
                quotes = [{"quote": "Victory belongs to the most persevering.", "author": "Napoleon Bonaparte"}]
            elif "da vinci" in q_lower:
                quotes = [{"quote": "Simplicity is the ultimate sophistication.", "author": "Leonardo da Vinci"}]

        related_topics = [f"{request.q} {suffix}" for suffix in ["timeline", "impact", "legacy"]]
        
        response_data = EnhancedSearchResponse(
            query=request.q,
            results=results,
            images=images,
            quotes=quotes,
            related_topics=related_topics,
            summary=wikipedia_data.get("extract") if wikipedia_data else None
        )
        
        await cache.set(cache_key, response_data.dict(), ttl=86400)
        return response_data
            
    except Exception as e:
        logger.error(f"Enhanced search failure for '{request.q}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="The historical archive search failed.")

@router.post("/relationships")
async def find_historical_relationships(request: SearchRequest):
    """Placeholder for future relationship graph mapping"""
    return {"query": request.q, "relationships": []}

@router.get("/timeline/{topic}")
async def get_topic_timeline(topic: str):
    """Direct access to topic-specific chronology"""
    return {"topic": topic, "events": []}

@router.post("/ai-insights")
async def get_ai_insights(request: SearchRequest):
    """Integration hook for advanced historical LLM analysis"""
    return {"query": request.q, "insights": None}
