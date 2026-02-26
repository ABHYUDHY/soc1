from __future__ import annotations

from collections import defaultdict

MEMORY: dict[str, list[dict]] = defaultdict(list)


def remember(tenant_id: str, event: dict) -> None:
    MEMORY[tenant_id].append(event)


def get_history(tenant_id: str) -> list[dict]:
    return MEMORY[tenant_id][-200:]
