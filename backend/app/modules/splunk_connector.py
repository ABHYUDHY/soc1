from __future__ import annotations


async def ingest_from_splunk() -> list[dict]:
    return [{"source": "splunk", "event": "failed login from 10.4.1.2"}]
