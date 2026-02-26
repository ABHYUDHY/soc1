from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from app.core.store import store
from app.models.schemas import Incident, IncidentIn
from app.modules.audit_logger import log_event
from app.modules.case_manager import create_case
from app.modules.command_verifier import verify_command
from app.modules.detector import detect
from app.modules.historical_memory import remember
from app.modules.intel_correlator import correlate_intel
from app.modules.llm_engine import LLMEngine
from app.modules.log_parser import parse_log
from app.modules.mitigation_generator import generate_mitigation
from app.modules.mitre_mapper import map_mitre
from app.modules.rag_retriever import retrieve_context
from app.modules.redis_client import redis_bus
from app.modules.risk_scoring_engine import score_risk
from app.modules.sla_tracker import compute_sla
from app.modules.threat_intel_fetcher import fetch_threat_intel


llm_engine = LLMEngine()


async def run_pipeline(incident_in: IncidentIn) -> Incident:
    parsed = parse_log(incident_in.raw_log)
    classification, conf, reason = detect(parsed)
    context = retrieve_context(incident_in.raw_log)
    llm_text = await llm_engine.analyze(f"Classify and explain SOC event: {incident_in.raw_log}\nContext: {context}")
    mitre = map_mitre(parsed)
    intel = await fetch_threat_intel(incident_in.raw_log)
    correlation = correlate_intel(intel)
    risk_score, risk_level = score_risk(incident_in.severity.value, max(conf, incident_in.confidence), incident_in.asset_criticality)
    mitigation = generate_mitigation(classification, context)
    command = "echo containment_applied" if classification == "malicious" else "echo monitor_only"
    approved, message = verify_command(command)
    execution = {"approved": approved, "message": message, "command": command, "status": "queued" if approved else "blocked"}

    incident = Incident(
        id=str(uuid4()),
        source=incident_in.source,
        tenant_id=incident_in.tenant_id,
        raw_log=incident_in.raw_log,
        parsed=parsed,
        classification=classification,
        confidence=max(conf, incident_in.confidence),
        reasoning=f"{reason}; LLM: {llm_text[:180]}",
        rag_references=context,
        mitre=mitre,
        threat_intel={**intel, "correlation": correlation},
        risk_score=risk_score,
        risk_level=risk_level,
        mitigation=mitigation,
        execution=execution,
        severity=incident_in.severity,
        status="Open",
        created_at=datetime.now(tz=timezone.utc),
    )
    store.put("incidents", incident.id, incident)
    case = create_case(incident.id, incident.tenant_id)
    sla = compute_sla(incident.severity.value, incident.created_at)
    remember(incident.tenant_id, {"incident": incident.model_dump(), "case": case.model_dump(), "sla": sla})
    log_event("Pipeline completed", {"incident_id": incident.id, "tenant_id": incident.tenant_id, "risk": risk_level})

    await redis_bus.publish("agent_planner", {"incident_id": incident.id, "decision": "plan generated"})
    await redis_bus.publish("agent_executor", {"incident_id": incident.id, "decision": "execution queued", "approved": approved})
    await redis_bus.publish("agent_auditor", {"incident_id": incident.id, "decision": "audit trail persisted"})
    return incident
