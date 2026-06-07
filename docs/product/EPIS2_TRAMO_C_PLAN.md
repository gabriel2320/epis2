# EPIS2 — Plan Tramo C (hospitalización y urgencias)

**Versión:** 1.0 · **Fecha:** 2026-06-07

---

## Secuencia canon

```text
Hospitalización general → Enfermería/MAR → Urgencias (emergency) → Farmacia avanzada → IAAS avanzada → Calidad centinela
```

---

## Estado actual (MF-TRAMO-C-002)

| Hito | Estado | IDC |
|------|--------|-----|
| Workspace `emergency` | ✅ Scaffold | 101–105 Active |
| Tablero triaje demo | ✅ | API + UI + E2E |
| Hospitalización censo | ◐ Partial | V2 service dashboard |
| MAR enfermería | ◐ Partial | V3 nursing tab |
| Bandeja órdenes extendida | Planned | 51–60 |

---

## Microfases recomendadas

| MF | Alcance | IDC |
|----|---------|-----|
| MF-TRAMO-C-003 | Ingreso hospitalario blueprint UI | 111+ |
| MF-TRAMO-C-004 | Bandeja órdenes activas | 51–57 |
| MF-TRAMO-C-005 | Tendencias resultados | 164 |
| MF-TRAMO-C-006 | Epicrisis urgencias | 110 |

---

## Gates

- `quality:tramo-c-emergency-gate` — scaffold urgencias
- `quality:golden-journey` — antes de signoff Tramo C

---

## Dependencias

- Tramo A ✅ cerrado
- Tramo B recepción ✅ UI demo

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
