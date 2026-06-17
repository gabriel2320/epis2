# EPIS2-V1 — UI signoff (export + OCR demo)

**Fecha:** 2026-06-05 · **Alcance:** Cerrar exposición UI del gate V1 longitudinal

## Contexto

Plan C (API) ya entregó intake, RAG pgvector, OCR endpoint y export PDF/TXT. Esta sesión cierra la **superficie web** alineada a M3.

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `downloadPatientSummaryExport` — export con cookie de sesión | ✓ |
| 2 | Botones export TXT/PDF en ficha longitudinal (sin `<a href>` directo) | ✓ |
| 3 | `runDocumentOcr` en cliente API | ✓ |
| 4 | `DocumentSearchPanel` — intake imagen + botón OCR demo | ✓ |
| 5 | Copy español (tipo intake, OCR, descarga) | ✓ |
| 6 | Test `DocumentSearchPanel` flujo OCR | ✓ |

## Gates API (ya existentes)

- `golden-v1-longitudinal-review` en `golden-clinical-journey.api.spec.ts`
- Migraciones pgvector `019` / `020`

## Gates sesión

- `npm run check` — OK (lint + typecheck + architecture:validate)
- `npm run test` — OK (289 passed, 20 skipped)
- `npm run db:validate` — OK

## Fix técnico

- `DocumentSearchPanel`: `EpisButton` usa `appearance="tonal"` (no `variant="tonal"`).

## Próximo paso

**EPIS2-13 / Plan D** — hospitalización operativa E2E UI, o hardening OCR/PDF productivo.
