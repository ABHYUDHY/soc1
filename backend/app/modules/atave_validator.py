from __future__ import annotations


def validate_action(action: str, command: str) -> tuple[bool, str]:
    if len(command.strip()) < 3:
        return False, "Command too short"
    if action.lower() not in {"approve", "execute", "modify"}:
        return False, "Invalid action"
    return True, "ATAVE validation passed"
