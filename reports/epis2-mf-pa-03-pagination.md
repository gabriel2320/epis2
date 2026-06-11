# MF-PA-03 — Paginación N/M real (motor bloques)

**Estado:** DONE · **Gate:** `quality:paper-mode-pagination-gate` · **Fecha:** 2026-06-11

## Entregables

- `paginatePaperChart` + `estimateBlockLines` + reserva firma (`signatureReserve`) en discharge
- `PaperChartMode` calcula `pages` y pasa `pageLayouts` al template
- `PaperChartTemplate` renderiza una hoja `.epis2-paper-page` por layout con footer `p. N/M`
- Tests unitarios en `paginatePaperChart.test.ts`

## Próximo

**MF-PA-04** — secciones papel VIII–XIV scaffold.
