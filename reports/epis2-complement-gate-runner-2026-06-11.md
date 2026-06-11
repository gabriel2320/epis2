# EPIS2 — Complement gate-runner 2026-06-11

Rol: subagente gate-runner (complemento cierre sesión).

## Fallos raíz detectados

| # | Suite / archivo | Mensaje |
|---|-----------------|---------|
| 1 | `scripts/quality/validate-dual-chart-ledger.test.mjs` | `No test suite found in file` — Vitest incluye `**/*.test.mjs` pero el archivo usaba `node:test` (incompatible con el runner Vitest del monorepo). |
| 2 | `apps/web/src/pages/PatientWorkspacePage.test.tsx` | `Unable to find an element by: [data-testid="epis2-patient-workspace"]` — `PatientWorkspacePage` enruta a `DualChartPatientPage` cuando `isDualChartModesEnabled()` es true (default en `import.meta.env.DEV`); el test valida el layout legacy UX-B.2. |

## Acción tomada

1. **`validate-dual-chart-ledger.test.mjs`** — Migrado a Vitest (`describe`/`it`/`expect`), alineado con `validate-microphase-ledger.test.mjs`. Expectativas actualizadas: programa PROG-DUAL-CHART completo (10 fases DONE, `ready === null`).
2. **`PatientWorkspacePage.test.tsx`** — Mock de `isDualChartModesEnabled → false` y partial mock de `useClassicMd3Mode → false` para forzar el path legacy con `epis2-patient-workspace`.

Sin cambios en `scripts/dev-agent/*`, sin commit.

## Verificación post-fix

| Gate | Comando | Estado |
|------|---------|--------|
| check | `npm run check` | OK |
| test | `npm run test` | OK — 262 files, 772 tests |
| db:validate | `npm run db:validate` | OK — 34 migraciones |

Tests afectados re-ejecutados antes del full run: `validate-dual-chart-ledger.test.mjs`, `PatientWorkspacePage.test.tsx` — ambos OK.

## Riesgo / nota

- El test de ficha legacy depende de desactivar dual-chart en entorno de test; si se elimina el layout legacy, el test debe migrarse o retirarse explícitamente.
- E2E que esperan `epis2-patient-workspace` siguen requiriendo `VITE_ENABLE_DUAL_CHART_MODES=false` en entornos dual (documentado en MF-DUAL-CHART-03).

## Próximo paso

Sesión puede cerrar con los tres gates verdes; commit bajo criterio humano.
