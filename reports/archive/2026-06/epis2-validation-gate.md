# EPIS2 — Validación de gate (V0–V4)

**Fecha:** 2026-06-04  
**Rama:** `master`

## Automático

| Check | Resultado |
|-------|-----------|
| `npm run db:migrate` | **17** migraciones OK |
| `npm test` | **144** tests, **53** archivos |
| Commits slice | V0–V5 slices en reports |

## Commits de versión (recientes)

| Versión | Commits |
|---------|---------|
| V1 longitudinal | `117cbeb`, `7ac8007` |
| V2 hospitalización | `aaa6e7d`, `8470f38` |
| V3 enfermería/farmacia | `be5eb59` + `017` draft types |
| V4 interop/ops | `a02689d`, `1bbd5c7` |
| V5 IA trazable | `feat(v5)` (este commit) |

## Slices cerrados vs gate completo

| Versión | Slice demo | Gate completo pendiente |
|---------|------------|-------------------------|
| V1 | ✓ | RAG, OCR, PDF |
| V2 | ✓ | Traslados, alta operativa |
| V3 | ✓ | Tableros rol, conciliación |
| V4 | ✓ | Writeback HL7/FHIR |
| V5 | ✓ | NL intent, pgvector RAG, evals |

## Gate humano pendiente

- [PILOT_DEMO_CHECKLIST.md](../docs/quality/PILOT_DEMO_CHECKLIST.md)
- Journeys V1–V4 en [EPIS2_GOLDEN_JOURNEYS.md](../docs/quality/EPIS2_GOLDEN_JOURNEYS.md)
