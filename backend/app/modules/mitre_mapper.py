from __future__ import annotations


MAPPING = {
    "powershell": {"tactic": "Execution", "technique_id": "T1059.001", "description": "PowerShell"},
    "bruteforce": {"tactic": "Credential Access", "technique_id": "T1110", "description": "Brute Force"},
    "ransomware": {"tactic": "Impact", "technique_id": "T1486", "description": "Data Encrypted for Impact"},
}


def map_mitre(parsed_log: dict) -> dict[str, str]:
    haystack = " ".join(str(v).lower() for v in parsed_log.values())
    for key, value in MAPPING.items():
        if key in haystack:
            return value
    return {"tactic": "Discovery", "technique_id": "T1087", "description": "Account Discovery"}
