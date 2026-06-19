# PROG-CONSOLIDATE — Cierre 2026-06-15

**Programa:** PROG-CONSOLIDATE · **Rama:** `chore/repo-consolidation-phase-0-1` · **PR:** [#6](https://github.com/gabriel2320/epis2/pull/6)

---

## Objetivo

Reducir deuda operativa del monorepo (~419 scripts npm, ~275 `quality:*`) sin romper CI ni golden journey.

## Fases entregadas

| Fase | Entrega | Verificación |
|------|---------|--------------|
| **0** | Snapshot + clasificador CSV | `tool:scripts:classify` |
| **1** | Manifiestos `required`/`nightly`, catálogo | `tool:gates:verify` |
| **2** | 245 `quality:*` podados → `quality:gate` + shims wired | 33 aliases root |
| **3** | `db:*` → `@epis2/api`, E2E → `@epis2/web` | shims root CI |
| **4** | Gates catalog-aware, `build:packages` + ai-client, CI fix test-fixtures | `tool:consolidate:verify-phase4` |

## Métricas

| Métrica | Antes | Después |
|---------|-------|---------|
| `quality:*` en root | ~272 | **33** |
| Gates en catálogo | — | **273** (`catalog-full.json`) |
| Scripts root (aprox.) | ~424 | **~150** |

## Gates humanos (usar estos)

| Cuándo | Comando |
|--------|---------|
| Iteración | `npm run quality:fast` |
| Pre-PR | `npm run quality:required` |
| CI extendido local | `npm run quality:nightly` |
| Gate MF histórico | `npm run quality:gate -- quality:<name>` |
| E2E tramo | `npm run test:e2e:tramo-j -w @epis2/web` |

## Artefactos

- `docs/EPIS2_CURRENT_STATE.md` — brújula
- `docs/MODULE_INVENTORY.md` — inventario
- `docs/MAINTENANCE_PACKAGE_SCRIPTS.md` — mantenimiento scripts
- `tools/gates/` — manifiestos + catálogo + runners
- `tools/legacy-scripts/` — snapshot pre-consolidación

## CI

- `.github/workflows/ci.yml` — build `@epis2/test-fixtures` antes de `case-intel-closure-gate`
- `build:packages` incluye `@epis2/ai-client` (fix `e2e-dual-chart`)

## Riesgos / no hecho

- No se migró `dev:*` / `ai:*` a tools (clasificados MOVE_TO_TOOLS — futuro opcional)
- No se archivaron ~486 reportes históricos
- `quality:required` aún no sustituye job CI completo (paridad vía `nightly.json`)

## Próximo paso recomendado

Merge PR #6 → retomar producto solo con MF autorizada explícita. Brújula: `docs/EPIS2_CURRENT_STATE.md`.
