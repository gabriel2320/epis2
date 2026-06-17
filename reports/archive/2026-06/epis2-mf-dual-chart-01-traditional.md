# MF-DUAL-CHART-01 — Paridad ficha electrónica tradicional

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Gate:** `npm run quality:dual-chart-traditional-gate`

## Alcance

`chartModeSearch`, grid clínico en `TraditionalEhrMode`, `ClinicalShell` en `/espacio/ficha` (flag), command bar transversal en layout `/espacio/*`.

## Entregables

- [x] `apps/web/src/routes/chartModeSearch.ts` + tests
- [x] `TraditionalEhrMode` integra `PatientClinicalSummaryGrid`
- [x] `PatientWorkspacePage` rama dual chart (`ClinicalShell` + modos)
- [x] `ClinicalShellLayout` — shell mínimo ficha + `ChartEspacioCommandDock`
- [x] `parseClinicalPatientSearch` extiende `chartMode` / `section` / `printFormat`
- [x] Gate traditional verde · `npm run check`

## Verificación

```bash
npm run quality:dual-chart-plan -- --phase 1 --verify
VITE_ENABLE_DUAL_CHART_MODES=true npm run dev:web
# /espacio/ficha?patientId=<demo>&chartMode=traditional
```

## Riesgos

- Modo dual activo en DEV por defecto (`isDualChartModesEnabled`) — legacy modern solo con flag `false`.
- Classic mode (`?mode=classic`) sigue usando `ClassicMd3WorkspaceLayout`.

## Próximo paso

**MF-DUAL-CHART-02** — blueprints Zod papel, API borrador, `/espacio/ficha/imprimir`  
`npm run dev:dual-chart:session`
