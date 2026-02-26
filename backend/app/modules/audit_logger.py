from __future__ import annotations

import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s [%(name)s] %(message)s")
audit_log = logging.getLogger("soc.audit")


def log_event(message: str, payload: dict) -> None:
    audit_log.info("%s | payload=%s", message, payload)
