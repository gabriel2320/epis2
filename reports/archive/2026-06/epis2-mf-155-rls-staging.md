# MF-155 — RLS staging fail-closed

**Estado:** DONE  
**Fecha:** 2026-06-05

## Entregables

- ADR-005 en `docs/DECISIONS.md`
- Runbook `docs/ops/RLS_STAGING_RUNBOOK.md`
- `.env.staging.example` + fail-closed en `loadConfig` (`NODE_ENV=production` → `RLS_MODE=enforce`)
- Migraciones `023_epis2_rls_force.sql`, `024_epis2_app_role.sql`
- Tests negativos `rls.integration.test.ts` (cross-actor)

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | 332 passed (epis2_app) |
| `quality:ci-parity` | OK |

## Riesgo

Actualizar `.env` local a `epis2_app` tras `db:migrate` con superuser `epis2`.

## Próximo

MF-183 (cerrado en misma sesión).
