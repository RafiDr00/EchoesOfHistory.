import httpx
import asyncio

WIKI_API = "https://en.wikipedia.org/w/api.php"


async def wiki_search(q: str):
    params = {
        "action": "query",
        "list": "search",
        "srsearch": q,
        "format": "json",
    }
    async with httpx.AsyncClient(timeout=10) as c:
        r = await c.get(WIKI_API, params=params)
        data = r.json()
        return data.get("query", {}).get("search", [])
