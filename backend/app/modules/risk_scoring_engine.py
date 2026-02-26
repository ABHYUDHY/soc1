from __future__ import annotations


def score_risk(severity: str, confidence: float, asset_criticality: float) -> tuple[float, str]:
    severity_weight = {"low": 1, "medium": 2, "high": 3, "critical": 4}.get(severity.lower(), 2)
    risk = round(severity_weight * confidence * asset_criticality * 25, 2)
    if risk < 25:
        level = "Low"
    elif risk < 50:
        level = "Medium"
    elif risk < 75:
        level = "High"
    else:
        level = "Critical"
    return risk, level
