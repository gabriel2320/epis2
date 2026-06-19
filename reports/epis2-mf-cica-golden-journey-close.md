# MF-CICA-GOLDEN-01 — Cierre (golden journey /app/*)

**Fecha:** 2026-06-18 · **Programa:** PROG-PURGE-CICA · **Tramo:** 4

## Alcance

Golden journey clínico en rutas CICA con producto GO.

| Entrega | Detalle |
|---------|---------|
| `e2e/golden-cica-journey.spec.ts` | buscar → evolución → firma → aprobación → `/app/buscar` |
| `CicaPatientSearchPage` | `data-testid="cica-patient-search-hero"` |
| `CicaNewEvolutionPage` | Acción `epis2-form-sign` (paridad legacy) |
| `test:e2e:golden-cica` | Script Playwright dedicado (`--fresh` puerto 5199) |
| `clinicalLayoutEngine` | Perfiles `letter-document` / `book-reader` (fix crash maxWidth) |
| `run-e2e.mjs` + `playwright.config.ts` | Evita reutilizar dev server stale en otro path |
| `demoPatient.ts` | Login CICA + `cica-patient-search-open-*` |

## Gates

| Gate | Resultado |
|------|-----------|
| `node scripts/quality/validate-cica-golden-journey-gate.mjs` | OK |
| `npm run test:e2e:golden-cica -w @epis2/web` | OK (con stack) |
| `npm run quality:clinical` | OK |

## Checklist Tramo 4 (reform plan)

- [x] CICA-L-01 score ≥ 90
- [x] Golden E2E `/app/*` (no solo redirects)
- [x] `quality:golden-journey` vitest verde
- [ ] Walkthrough institucional GO PILOT
- [ ] PR6 redirects E2E dedicado (legacy spec existente)

## Próximo paso

Walkthrough humano piloto + evaluar `VITE_ENABLE_CICA_UI` default ON en entorno demo.
