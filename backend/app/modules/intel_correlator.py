from __future__ import annotations


def correlate_intel(intel: dict) -> dict:
    malicious = intel["virustotal"]["verdict"] == "malicious"
    abuse = intel["abuseipdb"]["abuse_confidence"] > 80
    return {"reputation": "high-risk" if malicious or abuse else "moderate", "summary": "Threat intel correlated across providers"}
