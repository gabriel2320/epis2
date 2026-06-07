# EPIS2 — Cierre Tramo C (hospitalización + urgencias)

**MF-TRAMO-C-CLOSURE** · **Fecha:** 2026-06-07  
**Canon:** [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md) · [`EPIS2_TRAMO_C_PLAN.md`](./EPIS2_TRAMO_C_PLAN.md)

---

## Resultado declarado

```text
Workspace emergency → hub hospitalización ficha → tableros servicio/enfermería → epicrisis urgencias
```

**Estado:** ✅ **Cerrado técnicamente** (gates + E2E demo). Signoff clínico institucional pendiente.

---

## Microfases cerradas (C-002 … C-008)

| MF | Alcance | IDC clave |
|----|---------|-----------|
| MF-TRAMO-C-002 | Workspace urgencias + tablero triaje | 101–105 Active |
| MF-TRAMO-C-003 | Hub hospitalización ficha + ingreso | 111 Done |
| MF-TRAMO-C-004 | Órdenes activas servicio | CTA ficha → tablero |
| MF-TRAMO-C-005 | Tendencias bandeja resultados | 58 Done |
| MF-TRAMO-C-006 | Epicrisis tablero urgencias | 110 Active |
| MF-TRAMO-C-007 | Censo hospitalario servicio | V2 service dashboard |
| MF-TRAMO-C-008 | MAR enfermería | 116 Done |

---

## Gates obligatorios Tramo C

| Gate | Evidencia |
|------|-----------|
| `quality:tramo-c-emergency-gate` | Workspace + API urgencias |
| `quality:tramo-c-admission-gate` | Hub ficha + ingreso |
| `quality:tramo-c-orders-gate` | Órdenes activas servicio |
| `quality:tramo-c-trends-gate` | `ResultsInboxTrends` |
| `quality:tramo-c-epicrisis-gate` | CTA epicrisis urgencias |
| `quality:tramo-c-census-gate` | Censo ficha → servicio |
| `quality:tramo-c-mar-gate` | MAR ficha → enfermería → `/espacio/mar` |
| `quality:tramo-c-closure-gate` | Este documento |
| `quality:golden-journey` | Antes de signoff institucional |

---

## Métricas (2026-06-07)

```text
IDC Done Tramo C clave:  111 · 116 · 58 (+ 110 Active epicrisis urgencias)
Journeys demo:           ingreso · censo · órdenes · MAR · urgencias · epicrisis · tendencias
Gates técnicos:          check · test · db:validate · gates tramo-c
Signoff clínico:         pendiente institucional
Estado real:             Done técnico Tramo C
```

---

## Próximo tramo

**Tramo D** — programas especializados UCI (`EPIS2_TRAMO_D_PLAN.md`).

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
