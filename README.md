# EPIS2

EPIS2 is now a clean full stack clinical cockpit. The old inflated runtime was
removed, the useful product learning was preserved as reset notes, and the
active product is a small monolith built around patient work, audited clinical
writes, PostgreSQL, OpenAPI, and a new EPIS2 visual language.

OneEpis was used only as a read-only architecture donor. Do not modify OneEpis
from this repo and do not copy its UI.

## Current Shape

- `apps/web`: Next.js clinical cockpit with Tailwind, motion, React Query, and lucide.
- `apps/api`: FastAPI API with Pydantic, SQLAlchemy, Alembic, auth, audit, and optional AI.
- `packages/contracts`: committed OpenAPI contract exported from FastAPI.
- `infra`: isolated local PostgreSQL dev stack on port `5443`.
- `docs`: current architecture, governance, screen tree, security, and reset records.

The active runtime intentionally has no CICA compatibility layer, no legacy
`/espacio`, no dashboard home, no labs in core, no historical gate catalog, and
no package forest.

## Active Product Routes

```text
/login
/pacientes
/pacientes/nuevo
/pacientes/[patientId]/ficha
/pacientes/[patientId]/evoluciones/nueva
/pacientes/[patientId]/auditoria
/print/pacientes/[patientId]/ficha
```

`/` redirects to `/pacientes`.

## Local Development

Windows PowerShell:

```powershell
npm install
python -m venv .venv
.\.venv\Scripts\python -m pip install -e "apps/api[dev]"
$env:Path = "$PWD\.venv\Scripts;$env:Path"
docker compose -f infra/docker-compose.dev.yml up -d
npm run db:migrate
```

Run the API and web app in separate terminals:

```powershell
npm run dev:api
npm run dev:web
```

URLs:

- Web: <http://localhost:3100>
- API docs: <http://localhost:8100/docs>
- OpenAPI JSON: <http://localhost:8100/openapi.json>

Local credentials:

- `admin@epis2.local` / `admin`
- `medico@epis2.local` / `medico`
- `enfermeria@epis2.local` / `enfermeria`
- `lector@epis2.local` / `lector`

## Gates

Only these gates are official:

```powershell
npm run check:api
npm run check:web
npm run check:contract
npm run check:e2e
npm run check
```

`check:contract` also runs `apps/api/scripts/validate_reset_surface.py`, which
blocks legacy runtime tokens such as old CICA paths, `/espacio`, old labs, and
other reset-forbidden names from re-entering active code.

## Database

The local database is isolated by Compose project and volume name:

- Container: `epis2-mono-postgres`
- Volume: `epis2-mono-postgres-data`
- Port: `5443`
- URL: `postgresql+psycopg://epis2:epis2@localhost:5443/epis2`

Reset local data with:

```powershell
docker compose -f infra/docker-compose.dev.yml down -v
docker compose -f infra/docker-compose.dev.yml up -d
$env:Path = "$PWD\.venv\Scripts;$env:Path"
npm run db:migrate
```

## Documentation Map

- `docs/ARCHITECTURE.md`: runtime shape, data flow, API boundaries.
- `docs/DEVELOPMENT_PLAN.md`: phased plan for the complete AI-ready medical record.
- `docs/GOVERNANCE.md`: anti-inflation rules and feature admission checklist.
- `docs/SCREEN_TREE.md`: active routes and screen responsibilities.
- `docs/SECURITY_PRIVACY.md`: PHI, auth, audit, AI, dependency audit.
- `docs/reset/PRE_MONO_RESET_MANIFEST.md`: safety anchors for the reset.
- `docs/reset/CICA_DEVELOPMENT_PRESERVATION.md`: lessons preserved from CICA.
- `docs/reset/EPIS2_LEGACY_POINTERS.md`: forensic pointers to old EPIS2.

## Reset Boundary

The previous EPIS2 state is preserved by Git tag and documentation, not by
keeping old code inside the new product:

- Safety tag: `epis2-pre-mono-reset`
- Reset branch: `codex/epis2-mono-reset`
- Reset commit: `e9bfbf66`

Do not rehydrate legacy code into the active runtime. Convert useful old
learning into a model, schema, endpoint, screen, and test only if it passes the
governance checklist.

## Known Audit Note

`npm audit --omit=dev` currently reports a moderate PostCSS advisory through
Next.js 16.2.9's internal `postcss@8.4.31`. npm reports 16.2.9 as the latest
stable Next.js release in this workspace. Do not run `npm audit fix --force` for
this finding because it proposes a breaking downgrade to Next 9.
