# MF-NORM-04 — Audit radius traditional max 10px

**Estado:** DONE · **Gate:** `quality:ficha-norm-density-gate` · **Fecha:** 2026-06-11

## Hallazgos

| Área | Antes | Después |
|------|-------|---------|
| `ClinicalSummaryStickyBanner` | `20px` fijo | `epis2ShapeProfiles` por `surface` (8px traditional · 20px calm) |
| `chart/**` | Sin violaciones hardcoded | Gate grep OK |
| `shape.ts` | Perfiles documentados | `clampTraditionalRadiusPx()` + doc calm solo navSummary |

## Regla

- **Traditional EMR:** `epis2ShapeProfiles.traditional.max` = **10px**
- **Calm mosaico:** `calm.island` 20px **solo** con `surfaceProfile="calm"` en resumen

## Próximo

**MF-NORM-05** — tipografía, padding, bold budget + icon budget workspace 10.
