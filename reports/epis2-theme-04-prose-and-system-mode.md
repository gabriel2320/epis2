# EPIS2-THEME-04 — Prosa clínica y modo sistema

**Fecha:** 2026-06-05 · **Alcance:** `epis2ClinicalProseSx` en evolución/epicrisis + `prefers-color-scheme`

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `blueprintUsesClinicalProse` — evolution_note + discharge_summary | ✓ |
| 2 | `EpisClinicalForm` / campos textarea con `65ch` | ✓ |
| 3 | `Epis2ThemeModePreference` — light / dark / system | ✓ |
| 4 | `resolveEffectiveThemeMode` + suscripción OS | ✓ |
| 5 | Selector «Seguir sistema» en preferencias | ✓ |
| 6 | Toggle modo respeta modo efectivo | ✓ |

## Gates

```bash
npm run check
npm run test
npm run db:validate
```

## Próximo paso

**THEME-05** — Validación dark + alto contraste en journey manual; `epis2NumericCellSx` en Data Grid.
