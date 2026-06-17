# MF-FF-07 — Acciones probables en toda ficha

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 3  
**Gate:** `npm run quality:clinical-productivity-gate` ✓ · `quality:di-suggestions-gate` ✓

---

## Alcance

Cablear acciones probables (MF-DI-05) en **todas** las rutas de ficha, no solo el path dual-chart.

## Cambios

| Artefacto | Entrega |
|-----------|---------|
| `PatientWorkspacePage.tsx` | Cálculo central `getProbablePatientActionChips`; panel en workspace legacy + props a classic/dual |
| `DualChartPatientPage.tsx` | Recibe chips desde parent (sin duplicar lógica) |
| `PatientWorkspacePage.test.tsx` | Assert `epis2-clinical-probable-actions` en path compacto |
| `validate-di-suggestions-gate.mjs` | Verifica wiring en `PatientWorkspacePage` |

## Rutas cubiertas

| Path | Panel probable |
|------|----------------|
| Dual chart (default) | `TraditionalEhrMode` vía props parent |
| Classic MD3 | `PatientClinicalSummaryGrid` |
| Workspace compacto (dual OFF) | `ClinicalProbableActionsPanel` en columna primaria |

## Gates

```bash
npm run quality:di-suggestions-gate
npm run quality:clinical-productivity-gate
npm run dev:rapid
```

## Próximo paso

**MF-FF-08** — Live templates en web (`quality:clinical-productivity-gate`).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
