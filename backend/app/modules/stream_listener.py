from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator


async def stream_logs(feed: list[str]) -> AsyncIterator[str]:
    for row in feed:
        await asyncio.sleep(0.05)
        yield row
