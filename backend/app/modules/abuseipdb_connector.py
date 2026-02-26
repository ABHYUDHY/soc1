from __future__ import annotations


async def query_abuseipdb(indicator: str) -> dict:
    score = 92 if indicator.count(".") == 3 else 30
    return {"engine": "AbuseIPDB", "indicator": indicator, "abuse_confidence": score}
