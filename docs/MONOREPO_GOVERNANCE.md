# EPIS2 — Gobierno del monorepo

**Versión:** 1.1 · **Programa:** PROG-CONSOLIDATE-2 · **Estado:** ✓ MF-CON-03 (validator + archive index)

Plan: [`product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md`](product/EPIS2_CONSOLIDATION_PHASE2_PLAN.md) · Freeze: [`CONSOLIDATION_FREEZE.md`](CONSOLIDATION_FREEZE.md)

---

## Estructura actual (verdad del repo)

```text
epis2/
├── apps/
│   ├── web/          # UI clínica React
│   └── api/          # Fastify + PostgreSQL SoT
├── packages/         # Contratos, registries, UI libs, fixtures
├── services/
│   ├── local-ai/     # Runtime IA opcional
│   ├── clinical-case-intel/   # lab in-repo (SIM/case intel)
│   └── drug-intel/   # lab in-repo
├── tools/            # gates, scripts classify, run-e2e
├── scripts/          # quality, dev-agent, db, stack
├── database/         # migraciones SoT
├── e2e/              # Playwright (invocado vía @epis2/web)
└── reports/          # histórico sesiones → subconjunto a archive/
```

**Satélites (no importar como código):** `../epis2-evolab`, `../EPIS2-MedRepo` — contrato HTTP/JSON.

---

## Clasificación

| Clase | Qué es | Ejemplos |
|-------|--------|----------|
| **Core producto** | Demo clínica mínima autorizada | web, api, contracts, clinical-forms, command-registry, design-system, epis2-ui |
| **Labs in-repo** | Sintéticos / intel auxiliar | clinical-case-intel, drug-intel |
| **Runtime servicio** | Proceso aparte opcional | local-ai |
| **Tools** | Dev, CI, agentes | tools/, scripts/quality, .github/, .cursor/ |
| **Archive** | Evidencia histórica | reports/archive/, docs legacy marcados |

---

## Reglas de dependencia

| Origen | Puede depender de | No puede depender de |
|--------|-------------------|---------------------|
| `apps/web` | packages/*, `@epis2/ai-client` | `@epis2/local-ai`, services/* directo, tools/* |
| `apps/api` | packages/*, services vía HTTP/adapters | imports UI, OpenMRS, EPIS sin manifest |
| `packages/*` core | otros packages core | services/*, apps/* |
| `services/local-ai` | packages, `@epis2/ai-client` | apps/web |
| `tools/*` | scripts/, lectura repo | — |
| Labs | packages, API HTTP | ser importados por web |

Validadores: `npm run architecture:validate` · `npm run quality:core-no-labs-imports-gate`

**Frontera labs (PROG-CORE-LABS-FW):** `apps/web`, `apps/api` y `packages/*` no declaran ni importan `@epis2/clinical-case-intel` ni `@epis2/drug-intel`. Labs operan vía CLI/HTTP; promoción a core usa tablas staging en API (`/api/admin/drug-intel`) — documentada, no import directo.

---

## Movimiento de código (cuándo sí)

1. Declarar MF-CON-* en plan ola 2.
2. Preferir **archive** antes que **delete**.
3. Tras mover reports viejos: `reports/archive/YYYY-MM/`.
4. **No** crear `labs/evolab/` en este repo.
5. Ejecutar `architecture:validate` + gate del tramo.

---

## Scripts npm por zona

| Zona | Dónde viven los comandos |
|------|--------------------------|
| Core diario | root: ver [`dev/SCRIPT_INDEX.md`](dev/SCRIPT_INDEX.md) — máx 18 scripts |
| DB | `@epis2/api` + shims root `db:*` |
| E2E | `@epis2/web` + shim root `test:e2e` |
| Gates MF históricos | `npm run quality:gate -- quality:*` |
| Scripts archivados | `npm run tool:script -- <name>` |

Ver [`MAINTENANCE_PACKAGE_SCRIPTS.md`](MAINTENANCE_PACKAGE_SCRIPTS.md).
