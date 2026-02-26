from __future__ import annotations

from fastapi import HTTPException

ROLE_RANK = {"Analyst": 1, "Manager": 2, "Admin": 3}


def enforce_role(current_role: str, required: str) -> None:
    if ROLE_RANK.get(current_role, 0) < ROLE_RANK.get(required, 0):
        raise HTTPException(status_code=403, detail="Insufficient privileges")
