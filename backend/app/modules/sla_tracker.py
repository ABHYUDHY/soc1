from __future__ import annotations

from datetime import datetime, timedelta, timezone

POLICY = {"critical": 1, "high": 4, "medium": 24, "low": 48}


def compute_sla(severity: str, created_at: datetime) -> dict:
    due = created_at + timedelta(hours=POLICY.get(severity.lower(), 24))
    now = datetime.now(tz=timezone.utc)
    remaining = (due - now).total_seconds()
    return {"due_at": due.isoformat(), "remaining_seconds": remaining, "breached": remaining < 0}
