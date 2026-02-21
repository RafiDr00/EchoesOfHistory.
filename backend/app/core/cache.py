import os
import aioredis
import json
import logging
from datetime import timedelta

logger = logging.getLogger(__name__)

class RedisCache:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.redis = None

    async def connect(self):
        if not self.redis:
            try:
                self.redis = await aioredis.from_url(
                    self.redis_url, 
                    encoding="utf-8", 
                    decode_responses=True
                )
                logger.info(f"Connected to Redis at {self.redis_url}")
            except Exception as e:
                logger.error(f"Failed to connect to Redis: {e}")

    async def get(self, key: str):
        if not self.redis:
            await self.connect()
        try:
            data = await self.redis.get(key)
            return json.loads(data) if data else None
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None

    async def set(self, key: str, value: any, ttl: int = 86400):
        if not self.redis:
            await self.connect()
        try:
            await self.redis.set(key, json.dumps(value), ex=ttl)
        except Exception as e:
            logger.error(f"Redis set error: {e}")

cache = RedisCache()
