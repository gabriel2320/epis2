# EPIS2 — MF-TRAMO-D-002/003/004 Scaffold UCI

**Fecha:** 2026-06-07

## Alcance

Habilitar workspace UCI con tablero demo tras cierre Tramo C: monitorización, sábana clínica y hemodinámica.

## MF-TRAMO-D-002 — Rail + tablero UCI

| Entregable | Detalle |
|------------|---------|
| Registry | Rail `icu` → `tab=icu` (sin disabled) |
| API | `/api/dashboard/icu` |
| UI | `IcuDashboardTab` + tab dashboard |
| IDC | **41** Active |
| Gate | `quality:tramo-d-icu-gate` |
| E2E | `e2e/tramo-d-icu.spec.ts` |

## MF-TRAMO-D-003 — Sábana clínica

| Entregable | Detalle |
|------------|---------|
| UI | `epis2-icu-flowsheet` — horas demo FC/PAM/SpO₂ |
| IDC | **42** Active |
| Gate | `quality:tramo-d-flowsheet-gate` |

## MF-TRAMO-D-004 — Hemodinámica

| Entregable | Detalle |
|------------|---------|
| UI | `epis2-icu-hemodynamics` — PAM/PVC/lactato demo |
| IDC | **135** Active |
| Gate | `quality:tramo-d-hemodynamics-gate` |

## Nota IDC 41

Tensión semántica: `admission_note` también referencia IDC 41 (ingreso clínico). Dashboard UCI IDC 41 ≠ blueprint ingreso — ver `EPIS2_TRAMO_D_UCI_INVENTORY.md`.

## Próximo paso

MF-TRAMO-D-005+ — balance hídrico IDC 43, ventilación IDC 44, o cierre Tramo D parcial.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
