import httpx
from typing import List, Optional, Dict, Any
import logging
from pydantic import BaseModel
import asyncio

logger = logging.getLogger(__name__)

# Singleton HTTP client for connection pooling
_http_client: Optional[httpx.AsyncClient] = None

async def get_http_client() -> httpx.AsyncClient:
    global _http_client
    if _http_client is None:
        _http_client = httpx.AsyncClient(
            timeout=httpx.Timeout(10.0, connect=5.0),
            limits=httpx.Limits(max_connections=100, max_keepalive_connections=20)
        )
    return _http_client

async def close_http_client():
    global _http_client
    if _http_client:
        await _http_client.aclose()
        _http_client = None

class MediaItem(BaseModel):
    url: str
    title: str
    description: Optional[str] = None
    type: str  # "image", "video", "audio"
    source: str
    credit: Optional[str] = None
    thumbnail: Optional[str] = None

class TimelineEvent(BaseModel):
    year: int
    title: str
    description: str
    importance: int = 5
    location: Optional[str] = None

class BiographySection(BaseModel):
    summary: str
    known_for: List[str] = []

class RelatedArticle(BaseModel):
    title: str
    url: str
    description: str
    category: str
    icon: str

class HistoryService:
    @staticmethod
    async def fetch_wikipedia_summary(query: str) -> Optional[Dict[str, Any]]:
        if not query: return None
        client = await get_http_client()
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '_')}"
        try:
            response = await client.get(url)
            if response.status_code == 200:
                return response.json()
            elif response.status_code != 404:
                logger.warning(f"Wikipedia API returned {response.status_code} for {query}")
        except Exception as e:
            logger.error(f"Wikipedia summary fetch error: {e}")
        return None

    @staticmethod
    async def fetch_media(query: str, limit: int = 8) -> List[MediaItem]:
        if not query: return []
        client = await get_http_client()
        media_items = []
        try:
            commons_url = "https://commons.wikimedia.org/w/api.php"
            params = {
                "action": "query",
                "format": "json",
                "generator": "search",
                "gsrsearch": query,
                "gsrlimit": limit,
                "prop": "imageinfo",
                "iiprop": "url|size|mime|extmetadata",
                "iiurlwidth": 800
            }
            response = await client.get(commons_url, params=params)
            if response.status_code == 200:
                data = response.json()
                if "query" in data and "pages" in data["query"]:
                    for _, page in data["query"]["pages"].items():
                        if "imageinfo" in page:
                            img_info = page["imageinfo"][0]
                            metadata = img_info.get("extmetadata", {})
                            media_items.append(MediaItem(
                                url=img_info.get("thumburl", img_info.get("url")),
                                title=page.get("title", "").replace("File:", ""),
                                description=metadata.get("ImageDescription", {}).get("value", "")[:200],
                                type="image",
                                source="wikimedia",
                                credit=metadata.get("Credit", {}).get("value", "Wikimedia Commons")
                            ))
        except Exception as e:
            logger.error(f"Media fetch error for {query}: {e}")
        return media_items

    @staticmethod
    async def get_timeline(query: str) -> List[TimelineEvent]:
        # Professional Default Data
        timeline_data = {
            "leonardo da vinci": [
                TimelineEvent(year=1452, title="Birth", description="Born in Vinci, Italy", importance=8),
                TimelineEvent(year=1503, title="Mona Lisa", description="Began painting his most famous work", importance=10),
                TimelineEvent(year=1519, title="Death", description="Passed away in Amboise, France", importance=9),
            ],
            "napoleon": [
                TimelineEvent(year=1769, title="Birth", description="Born in Corsica", importance=8),
                TimelineEvent(year=1804, title="Emperor", description="Crowned Emperor of France", importance=10),
                TimelineEvent(year=1821, title="Death", description="Passed away on Saint Helena", importance=9),
            ],
            "cleopatra": [
                TimelineEvent(year=-69, title="Birth", description="Born in Alexandria", importance=8),
                TimelineEvent(year=-30, title="Death", description="End of the Ptolemaic Kingdom", importance=10),
            ]
        }
        q_lower = query.lower()
        for key, events in timeline_data.items():
            if key in q_lower:
                return events
        return []

    @staticmethod
    def get_related_articles(query: str) -> List[RelatedArticle]:
        return [
            RelatedArticle(
                title=f"{query} - Wikipedia",
                url=f"https://en.wikipedia.org/wiki/{query.replace(' ', '_')}",
                description=f"Detailed historical record and analysis of {query}",
                category="biography",
                icon="📚"
            )
        ]
