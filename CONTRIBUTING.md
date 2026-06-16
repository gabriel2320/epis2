# Contributing to EPIS2

Gracias por interesar en EPIS2. Este monorepo sigue **SDEPIS2** (olas, tramos, microfases) y un **congelamiento de consolidación** activo: no se aceptan features clínicas nuevas salvo MF autorizada.

## Antes de abrir un PR

1. Leer [`docs/CONSOLIDATION_FREEZE.md`](docs/CONSOLIDATION_FREEZE.md) y [`docs/EPIS2_CURRENT_STATE.md`](docs/EPIS2_CURRENT_STATE.md).
2. Leer [`AGENTS.md`](AGENTS.md) y [`docs/AGENT_CONTEXT_MINIMAL.md`](docs/AGENT_CONTEXT_MINIMAL.md) si usas Cursor.
3. Declarar alcance: MF-ID · archivos permitidos · gate de cierre.
4. **Un PR = un objetivo** (ver [`docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](docs/product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md)).

## Reglas no negociables

- **PostgreSQL = SoT** — borradores ≠ datos aprobados.
- **IA propone, humano aprueba** — sin auto-firma.
- **Sin PHI real** — solo datos sintéticos/demo.
- **No importar** desde `../Epis` sin `legacy-import-manifest.json`.
- **Home = Centro de Comando / censo** — no dashboard-first.

Invariantes: [`docs/product/PRODUCT_INVARIANTS.md`](docs/product/PRODUCT_INVARIANTS.md).

## Setup local

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:migrate
npm run dev:api   # :3001
npm run dev:web   # :5173
```

## Gates

| Cuándo | Comando |
|--------|---------|
| Iteración | `npm run quality:fast` |
| Cambio API/config | `npm run quality:clinical` |
| Pre-merge | `npm run quality:required` |

CI required corre en PR; nightly/experimental en workflows separados.

## Estilo de código

- Diff mínimo; reutilizar patrones existentes (`EpisRadDashboardTabShell`, registries).
- ESLint + Prettier (`npm run check`).
- Commits: mensaje claro en español o inglés; enfoque en el *por qué*.

## Legacy EPIS

EPIS es **donante de referencia**, no dependencia runtime. Ver [`docs/legacy/EPIS_POSTMORTEM.md`](docs/legacy/EPIS_POSTMORTEM.md).

## Legal

Al contribuir, aceptas que el proyecto es demo/desarrollo — [`DISCLAIMER.md`](DISCLAIMER.md). Licencia: [`LICENSE`](LICENSE) (MIT).
