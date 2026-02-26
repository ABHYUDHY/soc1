from __future__ import annotations


async def ingest_from_wazuh() -> list[dict]:
    return [{"source": "wazuh", "event": "powershell encoded command detected"}]
