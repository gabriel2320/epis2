# MF-NORM-05 — Audit tipografía padding bold budget

**Estado:** DONE · **Gate:** `quality:ficha-norm-typography-gate` · **Fecha:** 2026-06-11

## Cambios

| Regla | Valor |
|-------|-------|
| `EPIS_ICON_BUDGET.workspace` | 12 → **10** |
| `EPIS_CLINICAL_CARD_MAX_FONT_WEIGHT` | **600** (único peso fuerte por tarjeta/nav) |
| Nav secciones | `Typography body2` → `EpisM3Text bodyMedium` |
| Resumen cards | Ya usaban `EpisM3Text` + escala tokens |

## Gate

Sin `fontWeight 700+` en `chart/` ni `clinical-summary/` (headers institucionales y papel: 700 → 600).

## Próximo

**MF-NORM-06** demo cases · **MF-NORM-07** tema clinical-calm · **MF-TE-02** desbloqueado.
