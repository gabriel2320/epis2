# MF-DUAL-CHART-03 — Router switch chartMode en /espacio/ficha

**Estado:** DONE  
**Gate:** `npm run quality:dual-chart-router-gate`  
**Fecha:** 2026-06-10

## Alcance

- Página dedicada `DualChartPatientPage` detrás de `isDualChartModesEnabled()`.
- `PatientWorkspacePage` delega la rama dual; mantiene flujos classic MD3 y legacy split.
- Default canónico `chartMode=traditional` (URL sync + selección paciente).
- E2E `/espacio/ficha` en `e2e/dual-chart-modes.spec.ts`.

## Archivos

| Archivo | Cambio |
|---------|--------|
| `apps/web/src/pages/DualChartPatientPage.tsx` | Nueva — shell dual + redirect default |
| `apps/web/src/pages/PatientWorkspacePage.tsx` | Delegación + `chartMode` en pick |
| `e2e/dual-chart-modes.spec.ts` | Journey `/espacio/ficha` (g, h) |
| `docs/quality/dual-chart-ledger.json` | MF-03 DONE · MF-04 READY |

## Gates

```bash
npm run quality:dual-chart-router-gate
npm run check
```

## Riesgos

- En DEV el flag dual está activo por defecto; E2E legacy que esperan `epis2-patient-workspace` requieren `VITE_ENABLE_DUAL_CHART_MODES=false` o modo classic explícito.

## Próximo paso

**MF-DUAL-CHART-04** — Anatomía shell v2 (`ClinicalInstitutionalHeader`, `PatientIdentityBand`, `ClinicalActionBar`, `ClinicalFooterStatus`).
