# EPIS2 — MF-TRAMO-D-005/006 Balance hídrico + Ventilación UCI

**Fecha:** 2026-06-07

## Alcance

Profundizar tablero UCI con balance hídrico estricto y parámetros de ventilación demo.

## MF-TRAMO-D-005 — Balance hídrico (IDC 43)

| Entregable | Detalle |
|------------|---------|
| API | `fluidBalance` por turno + `netFluidBalanceMl` |
| UI | `epis2-icu-fluid-balance` + métrica neto |
| IDC | **43** Active |
| Gate | `quality:tramo-d-fluid-balance-gate` |
| E2E | `e2e/tramo-d-icu.spec.ts` |

## MF-TRAMO-D-006 — Ventilación (IDC 44)

| Entregable | Detalle |
|------------|---------|
| API | `ventilation` — modo, FiO₂, PEEP, PIP |
| UI | `epis2-icu-ventilation` |
| IDC | **44** Active |
| Gate | `quality:tramo-d-ventilation-gate` |
| E2E | `e2e/tramo-d-icu.spec.ts` |

## Próximo paso

MF-TRAMO-D-007 — vías invasivas IDC 45 · epicrisis traslado UCI IDC 50 · cierre parcial Tramo D.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
