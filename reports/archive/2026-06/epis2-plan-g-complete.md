# EPIS2 — Plan G completo (CI y calidad continua)

**Fecha:** 2026-06-05  
**Estado:** cerrado

## Entregables

| # | Tarea | Estado |
|---|-------|--------|
| G1 | `npm run qa:bundle-analyze` en CI (falla si excede gzip MUI X) | ✓ |
| G2 | `quality:golden-journey` — V0–V5 API en `golden-clinical-journey.api.spec.ts` | ✓ |
| G3 | Dependabot semanal + `npm audit --omit=dev --audit-level=high` en CI | ✓ |
| G4 | LIC-007 cerrado: lista + DatePicker (Community), sin Scheduler Premium | ✓ |

## CI (`.github/workflows/ci.yml`)

Orden final del job `check`:

1. `npm run check`
2. `npm run test`
3. `npm run db:validate`
4. `npm run ai:evals`
5. `npm run quality:golden-journey`
6. `npm run qa:bundle-analyze`
7. `npm audit --omit=dev --audit-level=high`

## Presupuestos bundle

Ver `scripts/qa/bundle-analyze.mjs` y `reports/epis2-m3-09-bundle-budget.md`.

## LIC-007 (Scheduler)

Decisión en `docs/design/MUI_LICENSING_DECISION_LOG.md`: **APPROVED** Community — worklist + `EpisDatePicker` para MVP; spike `EventCalendar` permanece en `/dev/scheduler-spike` sin merge clínico.

## Gates locales

```bash
npm run check && npm run test && npm run db:validate
npm run ai:evals && npm run quality:golden-journey
npm run qa:bundle-analyze
npm audit --omit=dev --audit-level=high
```

## Riesgos / seguimiento

- Vitest 3.x: advisory GHSA-5xrq (UI server) — dev-only; seguimiento vía Dependabot; evaluar upgrade a 4.x en sesión dedicada.

## Próximo

Piloto humano (`PILOT_DEMO_CHECKLIST.md`) o fases EPIS2-13+ según roadmap.
