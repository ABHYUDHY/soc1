from __future__ import annotations


SUSPICIOUS_PATTERNS = ["powershell", "mimikatz", "failed login", "ransomware", "c2", "bruteforce"]


def detect(parsed_log: dict) -> tuple[str, float, str]:
    haystack = " ".join(str(v).lower() for v in parsed_log.values())
    matched = [p for p in SUSPICIOUS_PATTERNS if p in haystack]
    if not matched:
        return "benign", 0.35, "No known suspicious pattern matched"
    confidence = min(0.55 + len(matched) * 0.1, 0.98)
    return "malicious", confidence, f"Matched patterns: {', '.join(matched)}"
