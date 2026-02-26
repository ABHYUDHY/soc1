from __future__ import annotations

BLOCKLIST = ["rm -rf /", "mkfs", "shutdown", "reboot", "dd if=/dev"]


def verify_command(command: str) -> tuple[bool, str]:
    lowered = command.lower()
    for banned in BLOCKLIST:
        if banned in lowered:
            return False, f"Command rejected due to forbidden token: {banned}"
    return True, "Command approved"
