# EPIS2 API

FastAPI service for the EPIS2 clinical record domain.

## Responsibilities

- validate request/response schemas with Pydantic;
- own clinical writes and audit emission;
- persist truth in PostgreSQL through SQLAlchemy;
- expose OpenAPI for the frontend contract;
- provide local auth and optional AI suggestion boundaries.

## Local Commands

From the repository root:

```powershell
.\.venv\Scripts\python -m pip install -e "apps/api[dev]"
.\.venv\Scripts\python -m alembic -c apps/api/alembic.ini upgrade head
.\.venv\Scripts\python -m uvicorn epis2_api.main:app --reload --port 8100 --app-dir apps/api/src
.\.venv\Scripts\python -m pytest apps/api/tests
.\.venv\Scripts\python apps/api/scripts/export_openapi.py
```

The root scripts wrap these commands:

```powershell
$env:Path = "$PWD\.venv\Scripts;$env:Path"
npm run dev:api
npm run db:migrate
npm run check:api
npm run check:contract
```

## Boundaries

- Routes orchestrate HTTP flow and permissions.
- Schemas define wire shape.
- Repositories own query details.
- Services own domain behavior such as audit events, auth, and AI provider selection.
- Models represent persisted clinical truth.

No old TypeScript API, Fastify route, Drizzle schema, lab service, or CICA
compatibility layer belongs here.
