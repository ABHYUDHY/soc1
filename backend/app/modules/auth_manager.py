from __future__ import annotations

from app.core.security import create_access_token, hash_password, verify_password

USERS = {
    "analyst": {"password_hash": hash_password("analyst123"), "role": "Analyst", "tenant_id": "tenant-a"},
    "manager": {"password_hash": hash_password("manager123"), "role": "Manager", "tenant_id": "tenant-a"},
    "admin": {"password_hash": hash_password("admin123"), "role": "Admin", "tenant_id": "global"},
}


def authenticate(username: str, password: str) -> str | None:
    user = USERS.get(username)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return create_access_token(username, user["role"], user["tenant_id"])
