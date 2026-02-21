from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.history_service import HistoryService
from app.db import get_session
from app.models import SearchHistory
from sqlmodel import select
from datetime import datetime, timedelta
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class SearchIn(BaseModel):
    q: str

CACHE_TTL = timedelta(days=7)

@router.post("/query")
async def historical_query(payload: SearchIn, session=Depends(get_session)):
    """
    Standard Search Query:
    - Implements DB-backed persistent search history
    - Integrates with primary HistoryService
    """
    query_str = payload.q.strip()
    if not query_str:
        raise HTTPException(status_code=400, detail="Empty query string.")

    # Check database cache for historical records
    try:
        cutoff = datetime.utcnow() - CACHE_TTL
        stmt = select(SearchHistory).where(
            SearchHistory.query == query_str,
            SearchHistory.created_at >= cutoff
        )
        q_res = await session.exec(stmt)
        cached = q_res.first()
        
        if cached:
            try:
                data = json.loads(cached.response)
                logger.info(f"DB Cache hit for search: {query_str}")
                return {"query": query_str, "results": data, "cached": True}
            except json.JSONDecodeError:
                logger.warning(f"Malformed cache data for: {query_str}")
    except Exception as e:
        logger.error(f"Search cache failure: {e}")

    # Fetch from Primary History Service (Wikipedia Proxy)
    try:
        results = await HistoryService.fetch_wikipedia_summary(query_str)
        
        # Asynchronously store results in archive
        try:
            record = SearchHistory(
                query=query_str, 
                source="wikipedia", 
                response=json.dumps(results)
            )
            session.add(record)
            await session.commit()
        except Exception as e:
            logger.warning(f"Failed to archive search result: {e}")
            
        return {"query": query_str, "results": results, "cached": False}
    except Exception as e:
        logger.error(f"External search fetch fail: {e}")
        raise HTTPException(status_code=502, detail="Failed to retrieve historical record from external source.")
