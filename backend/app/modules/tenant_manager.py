from __future__ import annotations

TENANTS = {
    "tenant-a": {"id": "tenant-a", "name": "Tenant Alpha"},
    "tenant-b": {"id": "tenant-b", "name": "Tenant Bravo"},
}


def list_tenants() -> list[dict]:
    return list(TENANTS.values())


def ensure_tenant(tenant_id: str) -> None:
    if tenant_id not in TENANTS:
        raise ValueError(f"Unknown tenant: {tenant_id}")
