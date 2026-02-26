from __future__ import annotations


def generate_mitigation(classification: str, context: list[str]) -> dict:
    steps = [
        "Quarantine affected endpoint in EDR",
        "Block malicious IP/domain in firewall",
        "Rotate credentials for impacted accounts",
        "Collect volatile memory and relevant logs",
    ] if classification == "malicious" else ["Continue monitoring", "Create watchlist rule"]
    return {
        "title": f"{classification.upper()} containment playbook",
        "steps": steps,
        "context": context,
    }
