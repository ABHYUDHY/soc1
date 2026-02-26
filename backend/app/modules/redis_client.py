from __future__ import annotations

import json

import redis.asyncio as redis


class RedisBus:
    def __init__(self, url: str = "redis://redis:6379/0") -> None:
        self.url = url
        self._client: redis.Redis | None = None

    async def client(self) -> redis.Redis:
        if not self._client:
            self._client = redis.from_url(self.url, decode_responses=True)
        return self._client

    async def publish(self, stream: str, payload: dict) -> None:
        client = await self.client()
        await client.xadd(stream, {"payload": json.dumps(payload)})


redis_bus = RedisBus()
