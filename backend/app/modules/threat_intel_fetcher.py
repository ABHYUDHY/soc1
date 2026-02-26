from __future__ import annotations

from app.modules.abuseipdb_connector import query_abuseipdb
from app.modules.vt_connector import query_virustotal


async def fetch_threat_intel(indicator: str) -> dict:
    vt = await query_virustotal(indicator)
    abuse = await query_abuseipdb(indicator)
    cves = ["CVE-2021-44228"] if "jndi" in indicator.lower() else []
    otx = {"pulse_count": 4 if vt["verdict"] == "malicious" else 0}
    return {"virustotal": vt, "abuseipdb": abuse, "cves": cves, "alienvault_otx": otx}
