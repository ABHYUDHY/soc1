from __future__ import annotations

from app.models.schemas import IncidentIn


def normalize_ingestion(mode: str, payload: str, tenant_id: str) -> IncidentIn:
    source = {
        "manual_upload": "upload",
        "manual_paste": "paste",
        "ioc": "ioc",
        "dataset": "dataset",
        "syslog": "syslog",
        "firewall": "firewall",
        "windows": "windows",
        "api": "api",
    }.get(mode, "manual")
    return IncidentIn(source=source, tenant_id=tenant_id, raw_log=payload)
