from __future__ import annotations

import asyncio
from collections.abc import Awaitable, Callable


async def run_scheduler(job: Callable[[], Awaitable[None]], interval_seconds: int = 60) -> None:
    while True:
        await job()
        await asyncio.sleep(interval_seconds)
