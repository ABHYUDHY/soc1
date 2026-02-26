from __future__ import annotations


def normalize_siem_event(event: dict) -> dict:
    return {"source": event.get("source", "unknown"), "message": event.get("event", "")}
