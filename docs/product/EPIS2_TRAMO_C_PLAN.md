# EPIS2 — Plan Tramo C (hospitalización y urgencias)

**Versión:** 1.1 · **Fecha:** 2026-06-07

---

## Secuencia canon

```text
Hospitalización general → Enfermería/MAR → Urgencias (emergency) → Farmacia avanzada → IAAS avanzada → Calidad centinela
```

---

## Estado actual (MF-TRAMO-C-002 … C-008)

| Hito | Estado | IDC |
|------|--------|-----|
| Workspace `emergency` | ✅ Scaffold | 101–105 Active |
| Tablero triaje demo | ✅ | API + UI + E2E |
| Hub hospitalización ficha | ✅ **MF-TRAMO-C-003** | 111 Done |
| Ingreso / traslado UI | ✅ | `/espacio/ingreso` · `/espacio/traslado` |
| Órdenes activas servicio | ✅ **MF-TRAMO-C-004** | CTA ficha → tablero |
| Tendencias resultados | ✅ **MF-TRAMO-C-005** | IDC 58 Done + `ResultsInboxTrends` |
| Epicrisis urgencias | ✅ **MF-TRAMO-C-006** | IDC 110 Active + CTA tablero |
| Censo hospitalario | ✅ **MF-TRAMO-C-007** | Tablero servicio + CTA ficha |
| MAR enfermería | ✅ **MF-TRAMO-C-008** | IDC 116 Done + `/espacio/mar` |
| **Cierre Tramo C** | ✅ **MF-TRAMO-C-CLOSURE** | `EPIS2_TRAMO_C_CLOSURE.md` |

---

## Microfases recomendadas

| MF | Alcance | IDC |
|----|---------|-----|
| MF-TRAMO-C-003 | Ingreso hospitalario blueprint UI | 111 ✅ |
| MF-TRAMO-C-004 | Bandeja órdenes activas | 51–57 |
| MF-TRAMO-C-005 | Tendencias resultados | 58 ✅ |
| MF-TRAMO-C-006 | Epicrisis urgencias | 110 ✅ |
| MF-TRAMO-C-007 | Censo hospitalario | V2 service ✅ |
| MF-TRAMO-C-008 | MAR enfermería | 116 ✅ |

---

## Gates

- `quality:tramo-c-emergency-gate` — scaffold urgencias
- `quality:tramo-c-admission-gate` — hub hospitalización
- `quality:tramo-c-orders-gate` — órdenes servicio
- `quality:tramo-c-trends-gate` — tendencias bandeja resultados
- `quality:tramo-c-epicrisis-gate` — epicrisis tablero urgencias
- `quality:tramo-c-census-gate` — censo hospitalario
- `quality:tramo-c-mar-gate` — MAR enfermería
- `quality:tramo-c-closure-gate` — cierre técnico Tramo C
- `quality:golden-journey` — antes de signoff institucional

---

## Dependencias

- Tramo A ✅ cerrado
- Tramo B recepción ✅ UI demo

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
