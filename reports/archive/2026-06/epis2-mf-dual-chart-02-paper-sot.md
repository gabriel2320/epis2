# MF-DUAL-CHART-02 — Modo papel SoT + impresión

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Gate:** `npm run quality:dual-chart-paper-sot-gate`

## Alcance

Blueprints Zod, API borrador PostgreSQL, persistencia por sección, ruta print `/espacio/ficha/imprimir`.

## Entregables

- [x] `packages/clinical-forms/src/paper-chart/` — schema Zod + blueprint
- [x] `apps/api/src/clinical/paperChart.ts` — GET/PUT/PATCH `/api/patients/:id/paper-chart`
- [x] `usePaperChartDraft` — debounce + PATCH por sección
- [x] `PaperChartPrintPage` — Carta/A5
- [x] `draftType: paper_chart` en API
- [x] Gate paper-sot verde

## Verificación

```bash
npm run quality:dual-chart-plan -- --phase 2 --verify
```

## Próximo paso

**MF-DUAL-CHART-03** — `DualChartPatientPage` como ruta canónica default.
