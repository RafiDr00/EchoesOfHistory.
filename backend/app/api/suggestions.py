from fastapi import APIRouter
from typing import List, Dict
import logging
import asyncio
from pydantic import BaseModel
from app.services.history_service import get_http_client

logger = logging.getLogger(__name__)
router = APIRouter()

class SuggestionsResponse(BaseModel):
    suggestions: List[str]
    categories: Dict[str, List[str]]

# Standardized Historical Categorization
POPULAR_SUGGESTIONS = {
    "ancient": [
        "Julius Caesar", "Cleopatra", "Alexander the Great", "Socrates", 
        "Plato", "Aristotle", "Augustus", "Hannibal", "Spartacus"
    ],
    "medieval": [
        "Charlemagne", "William the Conqueror", "Joan of Arc", "Saladin",
        "Genghis Khan", "Marco Polo", "Thomas Aquinas", "Eleanor of Aquitaine"
    ],
    "renaissance": [
        "Leonardo da Vinci", "Michelangelo", "Galileo", "Christopher Columbus",
        "Martin Luther", "Machiavelli", "Shakespeare", "Copernicus"
    ],
    "modern": [
        "Napoleon Bonaparte", "George Washington", "Abraham Lincoln", 
        "Winston Churchill", "Franklin D. Roosevelt", "Mahatma Gandhi", 
        "Martin Luther King Jr.", "John F. Kennedy", "Marie Curie"
    ],
    "contemporary": [
        "Nelson Mandela", "Margaret Thatcher", "Ronald Reagan", 
        "Mikhail Gorbachev", "Barack Obama", "Malala Yousafzai"
    ],
    "civilizations": [
        "Ancient Egypt", "Roman Empire", "Ancient Greece", "Byzantine Empire",
        "Ottoman Empire", "British Empire", "Mongol Empire", "Aztec Empire",
        "Inca Empire", "Persian Empire", "Chinese Dynasties", "Viking Age"
    ],
    "events": [
        "World War I", "World War II", "French Revolution", "American Revolution",
        "Industrial Revolution", "Renaissance", "Crusades", "Cold War",
        "Great Depression", "Black Death", "Fall of Rome", "Magna Carta"
    ]
}

async def fetch_wikipedia_suggestions(query: str) -> List[str]:
    """Fetch suggestions from Wikipedia OpenSearch API using pooled client"""
    try:
        client = await get_http_client()
        url = "https://en.wikipedia.org/w/api.php"
        params = {
            "action": "opensearch",
            "search": query,
            "limit": 5,
            "namespace": "0",
            "format": "json"
        }
        response = await client.get(url, params=params, timeout=2.0)
        if response.status_code == 200:
            data = response.json()
            return data[1] if len(data) > 1 else []
    except Exception as e:
        logger.error(f"Wikipedia suggestions error: {e}")
    return []

def get_local_suggestions(query: str, limit: int = 5) -> List[str]:
    """Efficiently filter local popular topics"""
    query_lower = query.lower()
    suggestions = []
    
    for items in POPULAR_SUGGESTIONS.values():
        for item in items:
            if query_lower in item.lower() and item not in suggestions:
                suggestions.append(item)
                if len(suggestions) >= limit:
                    return suggestions
    return suggestions

@router.get("/")
async def get_search_suggestions(q: str = "") -> SuggestionsResponse:
    """
    Elite-level suggestion engine:
    - Standardized on pooled Async HTTP client
    - Cleaned controversial historical content
    - Intelligent merging of local and remote sources
    """
    if not q or len(q) < 2:
        return SuggestionsResponse(
            suggestions=list(dict.fromkeys([s for cat in POPULAR_SUGGESTIONS.values() for s in cat]))[:10],
            categories=POPULAR_SUGGESTIONS
        )
    
    # Concurrent fetching
    wikipedia_task = fetch_wikipedia_suggestions(q)
    local_suggestions = get_local_suggestions(q, limit=5)
    
    try:
        wikipedia_suggestions = await wikipedia_task
    except Exception:
        wikipedia_suggestions = []
    
    # Intelligent deduplication and prioritisation
    combined = list(dict.fromkeys(local_suggestions + wikipedia_suggestions))[:10]
    
    # Filter categories
    query_lower = q.lower()
    filtered_cats = {}
    for cat, items in POPULAR_SUGGESTIONS.items():
        matches = [i for i in items if query_lower in i.lower()]
        if matches:
            filtered_cats[cat] = matches[:5]
            
    return SuggestionsResponse(
        suggestions=combined,
        categories=filtered_cats
    )

@router.get("/trending")
async def get_trending_topics():
    return {
        "curated": ["Leonardo da Vinci", "Ancient Egypt", "Industrial Revolution"],
        "discovery": ["Viking Age", "Silk Road", "Byzantine Empire"]
    }
