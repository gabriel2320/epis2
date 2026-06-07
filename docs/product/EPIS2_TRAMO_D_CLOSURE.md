# EPIS2 — Cierre Tramo D (scaffold UCI)

**MF-TRAMO-D-CLOSURE** · **Fecha:** 2026-06-07  
**Canon:** [`EPIS2_TRAMO_D_PLAN.md`](./EPIS2_TRAMO_D_PLAN.md) · [`EPIS2_TRAMO_D_UCI_INVENTORY.md`](./EPIS2_TRAMO_D_UCI_INVENTORY.md)

---

## Resultado declarado

```text
Workspace icu → tablero monitorización → sábana · balance · ventilación · invasivos · epicrisis traslado
```

**Estado:** ✅ **Cerrado técnicamente** (scaffold demo UCI IDC 41–45, 50, 135). Signoff clínico e IDC 46–49 pendientes.

---

## Microfases cerradas (D-001 … D-008)

| MF | Alcance | IDC |
|----|---------|-----|
| MF-TRAMO-D-001 | Inventario UCI | 41–50, 131–140 |
| MF-TRAMO-D-002 | Rail + tablero UCI | 41 Active |
| MF-TRAMO-D-003 | Sábana clínica | 42 Active |
| MF-TRAMO-D-004 | Hemodinámica | 135 Active |
| MF-TRAMO-D-005 | Balance hídrico | 43 Active |
| MF-TRAMO-D-006 | Ventilación | 44 Active |
| MF-TRAMO-D-007 | Vías invasivas | 45 Active |
| MF-TRAMO-D-008 | Epicrisis traslado UCI | 50 Active |

---

## Gates obligatorios Tramo D

| Gate | Evidencia |
|------|-----------|
| `quality:tramo-d-inventory-gate` | Inventario + plan |
| `quality:tramo-d-icu-gate` | Workspace + API |
| `quality:tramo-d-flowsheet-gate` | IDC 42 |
| `quality:tramo-d-hemodynamics-gate` | IDC 135 |
| `quality:tramo-d-fluid-balance-gate` | IDC 43 |
| `quality:tramo-d-ventilation-gate` | IDC 44 |
| `quality:tramo-d-invasive-gate` | IDC 45 |
| `quality:tramo-d-icu-discharge-gate` | IDC 50 |
| `quality:tramo-d-closure-gate` | Este documento |

---

## Excepciones / Defer

- **IDC 46–49** — neurológico, escalas, vasoactivos, sedoanalgesia: Planned Future
- **IDC 131–134, 136–140** — UCI especializada: Planned Future
- **IDC 41** — tensión con `admission_note` ingreso clínico (ver inventario)
- **Pabellón 121–130** — fuera de alcance scaffold D

---

## Próximo tramo global

Signoff clínico Tramos A–D · `quality:golden-journey` · pabellón Ola 12.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
