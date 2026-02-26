from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.deps import current_user
from app.core.store import store
from app.models.schemas import CaseUpdate, IOCSubmission, IngestionRequest, LoginRequest, MitigationAction, TokenResponse
from app.modules.atave_validator import validate_action
from app.modules.auth_manager import authenticate
from app.modules.case_manager import update_case
from app.modules.data_ingestion import normalize_ingestion
from app.modules.historical_memory import get_history
from app.modules.pipeline_orchestrator import run_pipeline
from app.modules.rbac_controller import enforce_role
from app.modules.sandbox_executor import execute_in_sandbox
from app.modules.sla_tracker import compute_sla
from app.modules.tenant_manager import list_tenants

app = FastAPI(title="Enterprise AI SOC Platform", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


@app.post("/auth/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    token = authenticate(payload.username, payload.password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=token)


@app.get("/tenants")
async def tenants(_: dict = Depends(current_user)) -> list[dict]:
    return list_tenants()


@app.post("/ingest")
async def ingest(payload: IngestionRequest, user: dict = Depends(current_user)) -> dict:
    tenant_id = payload.tenant_id if user["role"] == "Admin" else user["tenant_id"]
    incident_in = normalize_ingestion(payload.mode, payload.payload, tenant_id)
    incident = await run_pipeline(incident_in)
    return incident.model_dump()


@app.post("/ioc")
async def submit_ioc(payload: IOCSubmission, user: dict = Depends(current_user)) -> dict:
    tenant_id = payload.tenant_id if user["role"] == "Admin" else user["tenant_id"]
    incident_in = normalize_ingestion("ioc", f"{payload.ioc_type}:{payload.ioc}", tenant_id)
    incident = await run_pipeline(incident_in)
    return incident.model_dump()


@app.get("/incidents")
async def incidents(user: dict = Depends(current_user)) -> list[dict]:
    rows = store.list("incidents", None if user["role"] == "Admin" else user["tenant_id"])
    return [r.model_dump() for r in rows]


@app.get("/cases")
async def cases(user: dict = Depends(current_user)) -> list[dict]:
    rows = store.list("cases", None if user["role"] == "Admin" else user["tenant_id"])
    return [r.model_dump() for r in rows]


@app.patch("/cases/{case_id}")
async def patch_case(case_id: str, payload: CaseUpdate, user: dict = Depends(current_user)) -> dict:
    enforce_role(user["role"], "Analyst")
    case = update_case(case_id, payload.status, payload.note, payload.evidence)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case.model_dump()


@app.post("/mitigation/execute")
async def execute_mitigation(payload: MitigationAction, user: dict = Depends(current_user)) -> dict:
    enforce_role(user["role"], "Manager")
    valid, message = validate_action(payload.action, payload.command)
    if not valid:
        raise HTTPException(status_code=400, detail=message)
    return await execute_in_sandbox(payload.command)


@app.get("/sla")
async def sla(user: dict = Depends(current_user)) -> list[dict]:
    items = store.list("incidents", None if user["role"] == "Admin" else user["tenant_id"])
    return [{"incident_id": inc.id, **compute_sla(inc.severity.value, inc.created_at)} for inc in items]


@app.get("/history")
async def history(user: dict = Depends(current_user)) -> list[dict]:
    return get_history(user["tenant_id"])


class SocketManager:
    def __init__(self) -> None:
        self.clients: list[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self.clients.append(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self.clients:
            self.clients.remove(websocket)

    async def broadcast(self, data: dict) -> None:
        for client in list(self.clients):
            try:
                await client.send_json(data)
            except Exception:
                self.disconnect(client)


socket_manager = SocketManager()


@app.websocket("/ws/live")
async def ws_live(websocket: WebSocket) -> None:
    await socket_manager.connect(websocket)
    try:
        while True:
            message = await websocket.receive_text()
            await socket_manager.broadcast({"type": "heartbeat", "message": message})
    except WebSocketDisconnect:
        socket_manager.disconnect(websocket)
