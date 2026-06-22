# EPIS2

EPIS2 is a rebuilt clinical cockpit: a small full stack monolith with a modern patient workspace, audited clinical writes, OpenAPI, PostgreSQL, and optional local AI.

## Stack

- Next.js + Tailwind + motion for the clinical cockpit.
- FastAPI + Pydantic for API validation.
- PostgreSQL + SQLAlchemy + Alembic for clinical truth.
- OpenAPI as the frontend/backend contract.
- Ollama optional for local clinical assistance.

## Local Development

```bash
npm install
python -m venv .venv
.venv/Scripts/python -m pip install -e "apps/api[dev]"
docker compose -f infra/docker-compose.dev.yml up -d
.venv/Scripts/python -m alembic -c apps/api/alembic.ini upgrade head
npm run dev:api
npm run dev:web
```

Web: <http://localhost:3100>
API: <http://localhost:8100/docs>

Local credentials:

- `admin@epis2.local` / `admin`
- `medico@epis2.local` / `medico`
- `enfermeria@epis2.local` / `enfermeria`
- `lector@epis2.local` / `lector`

## Gates

```bash
npm run check:api
npm run check:web
npm run check:contract
npm run check:e2e
npm run check
```

## Reset Boundary

CICA, legacy `/espacio`, the old Vite/Fastify/Drizzle monorepo, historical gates, labs, and accumulated packages are not part of the active runtime. Their preservation lives in `docs/reset` plus the tag `epis2-pre-mono-reset`.
