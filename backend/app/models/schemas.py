from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, Field


class Severity(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class CaseStatus(str, Enum):
    open = "Open"
    investigating = "Investigating"
    contained = "Contained"
    resolved = "Resolved"
    closed = "Closed"


class UserRole(str, Enum):
    analyst = "Analyst"
    manager = "Manager"
    admin = "Admin"


class IncidentIn(BaseModel):
    source: str
    tenant_id: str
    raw_log: str
    asset: str = "unknown"
    severity: Severity = Severity.medium
    confidence: float = Field(default=0.6, ge=0, le=1)
    asset_criticality: float = Field(default=0.7, ge=0, le=1)


class Incident(BaseModel):
    id: str
    source: str
    tenant_id: str
    raw_log: str
    parsed: dict[str, Any]
    classification: str
    confidence: float
    reasoning: str
    rag_references: list[str]
    mitre: dict[str, str]
    threat_intel: dict[str, Any]
    risk_score: float
    risk_level: str
    mitigation: dict[str, Any]
    execution: dict[str, Any]
    severity: Severity
    status: str
    created_at: datetime


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class CaseRecord(BaseModel):
    id: str
    incident_id: str
    tenant_id: str
    assigned_analyst: str
    status: CaseStatus
    notes: list[str]
    evidence: list[str]
    created_at: datetime
    acknowledged_at: Optional[datetime] = None
    mitigated_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None


class CaseUpdate(BaseModel):
    status: Optional[CaseStatus] = None
    note: Optional[str] = None
    evidence: Optional[str] = None


class MitigationAction(BaseModel):
    incident_id: str
    action: str
    command: str


class Tenant(BaseModel):
    id: str
    name: str


class IngestionRequest(BaseModel):
    tenant_id: str
    mode: str
    payload: str


class IOCSubmission(BaseModel):
    tenant_id: str
    ioc: str
    ioc_type: str = "ip"
