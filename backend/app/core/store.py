from __future__ import annotations

from collections import defaultdict
from threading import Lock
from typing import Any


class InMemoryStore:
    def __init__(self) -> None:
        self._data: dict[str, Any] = defaultdict(dict)
        self._lock = Lock()

    def put(self, collection: str, key: str, value: Any) -> None:
        with self._lock:
            self._data[collection][key] = value

    def get(self, collection: str, key: str) -> Any:
        return self._data[collection].get(key)

    def list(self, collection: str, tenant_id: str | None = None) -> list[Any]:
        values = list(self._data[collection].values())
        if tenant_id is None:
            return values
        return [v for v in values if getattr(v, "tenant_id", None) == tenant_id or v.get("tenant_id") == tenant_id]


store = InMemoryStore()
