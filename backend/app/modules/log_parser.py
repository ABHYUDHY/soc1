from __future__ import annotations

import json


def parse_log(raw_log: str) -> dict:
    try:
        return json.loads(raw_log)
    except json.JSONDecodeError:
        parts = [p.strip() for p in raw_log.split("|") if p.strip()]
        parsed = {"message": raw_log}
        for part in parts:
            if "=" in part:
                k, v = part.split("=", 1)
                parsed[k.strip()] = v.strip()
        return parsed
