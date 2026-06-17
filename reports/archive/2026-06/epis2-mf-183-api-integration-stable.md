# MF-183 — Integración API estable

**Estado:** DONE  
**Fecha:** 2026-06-05

## Fixes

- Export summary: slug ASCII (`safePatientExportSlug`) — corrige 500 `ERR_INVALID_CHAR`
- Censo idempotente: `resetInpatientDemoCensus` antes de tests inpatient/golden-v2
- `DATABASE_URL` con rol `epis2_app` (RLS efectivo)

## Gates

| Gate | Resultado |
|------|-----------|
| 10 suites integración | 0 fallos |
| `quality:ci-parity` | 332 passed, 0 skipped |

## Próximo

MF-184 (cerrado en misma sesión).
