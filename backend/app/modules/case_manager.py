from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from app.core.store import store
from app.models.schemas import CaseRecord, CaseStatus


def create_case(incident_id: str, tenant_id: str, analyst: str = "tier1") -> CaseRecord:
    case = CaseRecord(
        id=str(uuid4()),
        incident_id=incident_id,
        tenant_id=tenant_id,
        assigned_analyst=analyst,
        status=CaseStatus.open,
        notes=["Case auto-created by orchestrator"],
        evidence=[],
        created_at=datetime.now(tz=timezone.utc),
    )
    store.put("cases", case.id, case)
    return case


def update_case(case_id: str, status: CaseStatus | None, note: str | None, evidence: str | None) -> CaseRecord | None:
    case = store.get("cases", case_id)
    if not case:
        return None
    if status:
        case.status = status
        now = datetime.now(tz=timezone.utc)
        if status == CaseStatus.investigating and not case.acknowledged_at:
            case.acknowledged_at = now
        if status == CaseStatus.contained and not case.mitigated_at:
            case.mitigated_at = now
        if status in {CaseStatus.resolved, CaseStatus.closed} and not case.closed_at:
            case.closed_at = now
    if note:
        case.notes.append(note)
    if evidence:
        case.evidence.append(evidence)
    store.put("cases", case.id, case)
    return case
