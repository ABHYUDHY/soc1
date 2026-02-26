from __future__ import annotations


async def query_virustotal(indicator: str) -> dict:
    verdict = "malicious" if any(tok in indicator.lower() for tok in ["bad", "mal", "evil"]) else "clean"
    return {"engine": "VirusTotal", "indicator": indicator, "verdict": verdict, "detections": 8 if verdict == "malicious" else 0}
