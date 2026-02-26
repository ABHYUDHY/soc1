# Enterprise AI-Driven SOC Automation & Orchestration Platform

Production-ready SOC command center with FastAPI backend, React frontend, Redis orchestration bus, and Ollama-backed LLM analysis.

## Architecture
- **Backend:** FastAPI async API (`backend/app/main_api.py`) with modular SOC pipeline.
- **Frontend:** React + Vite dashboard with dark glassmorphism SOC UI.
- **Queue:** Redis streams for Planner/Executor/Auditor agents.
- **LLM:** Ollama (`mistral:7b`) with graceful fallback.
- **Sandbox:** Isolated command execution module.

## Backend Modules
`backend/app/modules` contains:
- Detection & ingestion: `detector.py`, `data_ingestion.py`, `log_parser.py`, `dataset_loader.py`, `stream_listener.py`, `ingestion_scheduler.py`
- AI & RAG: `llm_engine.py`, `rag_knowledge_base.py`, `rag_retriever.py`, `mitigation_generator.py`
- Validation: `command_verifier.py`, `atave_validator.py`
- Execution: `sandbox_executor.py`
- Analytics: `risk_scoring_engine.py`, `mitre_mapper.py`
- Threat intel: `threat_intel_fetcher.py`, `vt_connector.py`, `abuseipdb_connector.py`, `intel_correlator.py`
- Memory/audit: `historical_memory.py`, `audit_logger.py`
- Cases/SLA: `case_manager.py`, `sla_tracker.py`
- Auth/Tenancy: `auth_manager.py`, `rbac_controller.py`, `tenant_manager.py`
- SIEM: `splunk_connector.py`, `wazuh_connector.py`, `siem_normalizer.py`
- Orchestration: `redis_client.py`, `pipeline_orchestrator.py`

## API Surface
- `POST /auth/login` JWT authentication
- `POST /ingest` dual-mode ingestion (manual/automatic modes)
- `POST /ioc` IOC submission
- `GET /incidents` incident feed
- `GET /cases`, `PATCH /cases/{id}` case management
- `GET /sla` SLA countdown/breach
- `POST /mitigation/execute` manager-approved sandbox execution
- `GET /history` tenant historical memory
- `GET /tenants` multi-tenant lookup
- `WS /ws/live` real-time event stream

## How to run (recommended: Docker Compose)
### 1) Prerequisites
- Docker 24+
- Docker Compose v2+

### 2) Start all services
```bash
docker compose up --build -d
```

### 3) Pull Ollama model
```bash
docker exec -it $(docker ps -qf "name=ollama") ollama pull mistral:7b
```

### 4) Open the platform
- Frontend: `http://localhost:5173`
- Backend docs: `http://localhost:8000/docs`
- Redis: `localhost:6379`
- Ollama API: `http://localhost:11434`

### 5) Login credentials
- analyst / analyst123
- manager / manager123
- admin / admin123

### 6) Stop stack
```bash
docker compose down
```

## How to run locally (without Docker)
### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main_api:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Local URLs
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

## Kubernetes Deployment
```bash
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/platform.yaml
```

## SOC Pipeline
Detection → Analysis → Enrichment → Risk → Mitigation → Validation → Execution → Logging → Case Creation → SLA Tracking


## Environment Troubleshooting (CI / Restricted Network)
If `npm install` fails with `403 Forbidden` in restricted environments:
- The code changes can still be reviewed and linted via source checks.
- Run frontend install/build on a network-enabled machine or internal npm mirror.

### Offline Visual Preview (no npm required)
To validate layout/screenshots without installing frontend dependencies:
```bash
python3 -m http.server 8765 --directory frontend
```
Then open:
- `http://127.0.0.1:8765/offline-preview.html`

This preview is intended for alignment/chart sanity checks when Vite cannot be started.
