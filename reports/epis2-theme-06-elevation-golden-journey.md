# EPIS2-THEME-06 — Elevación tonal y golden journey tema

**Fecha:** 2026-06-05 · **Alcance:** Auditoría sombras + journey con preferencias sistema

## Hallazgos de auditoría

| Componente | Antes | Después |
|------------|-------|---------|
| `buildEpis2Shadows` | `shadows[8]` en dark | Toda la escala `none` |
| `EpisBrandMark` | `theme.shadows[2]` | Borde tonal |
| `EpisTrendChart` empty | `boxShadow: 1` | `epis2TonalContainerSx` |
| `EpisDataGrid` | borde inline | `epis2TonalContainerSx` |
| `MuiDialog` | solo `cardElevation` | borde `cardBorder` + sin sombra |

**Mantiene sombra funcional:** `powerBarFocusShadow` (anillo de foco, no elevación decorativa).

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `epis2-elevation.ts` — tokens tonales | ✓ |
| 2 | Primitivos/charts/grid alineados | ✓ |
| 3 | `tests/golden-clinical-journey-theme.spec.ts` | ✓ |
| 4 | `epis2-elevation.test.ts` | ✓ |

## Gates

```bash
npm run check
npm run test
npm run db:validate
```

## Próximo paso

**THEME-07** — Catálogo visual `/desarrollo/catalogo-visual` o ampliación QA manual PILOT_DEMO_CHECKLIST con preferencias sistema.
