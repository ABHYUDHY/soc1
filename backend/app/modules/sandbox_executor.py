from __future__ import annotations

import asyncio


async def execute_in_sandbox(command: str) -> dict:
    await asyncio.sleep(0.2)
    return {"command": command, "status": "completed", "output": f"Simulated execution for: {command}"}
