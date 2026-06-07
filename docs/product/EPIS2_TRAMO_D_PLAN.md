# EPIS2 — Plan Tramo D (programas especializados)

**Versión:** 1.2 · **Fecha:** 2026-06-07

---

## Secuencia canon

UCI · pabellón · anestesia · obstetricia · odontología · telemedicina · IoT · interop avanzada · facturación.

**Horizonte:** Post-core — scaffold UCI habilitado tras cierre técnico Tramo C.

---

## Estado

| Programa | IDC | Decisión | EPIS2 hoy |
|----------|-----|----------|-----------|
| UCI monitorización | 41–50 | Build demo | **MF-TRAMO-D-002** ✅ scaffold |
| Sábana clínica 24h | 42 | Build demo | **MF-TRAMO-D-003** ✅ |
| Balance hídrico | 43 | Build demo | **MF-TRAMO-D-005** ✅ |
| Ventilación | 44 | Build demo | **MF-TRAMO-D-006** ✅ |
| Hemodinámica | 135 | Build demo | **MF-TRAMO-D-004** ✅ |
| UCI 45–50, 131–134, 136–140 | — | Defer | Planned |
| Pabellón | 121–130 | Defer Ola 12 | — |
| Telemedicina | 95–100 | Defer Ola 9 | — |
| Facturación Chile | 11–20 | Defer Tramo B | Inventario ✅ |

---

## Microfases

| MF | Alcance | Estado |
|----|---------|--------|
| MF-TRAMO-D-001 | Inventario UCI | ✅ |
| MF-TRAMO-D-002 | Rail UCI + tablero IDC 41 | ✅ |
| MF-TRAMO-D-003 | Sábana clínica IDC 42 | ✅ |
| MF-TRAMO-D-004 | Hemodinámica IDC 135 | ✅ |
| MF-TRAMO-D-005 | Balance hídrico IDC 43 | ✅ |
| MF-TRAMO-D-006 | Ventilación IDC 44 | ✅ |

---

## Gates

- `quality:tramo-d-inventory-gate` — inventario
- `quality:tramo-d-icu-gate` — workspace + tablero
- `quality:tramo-d-flowsheet-gate` — sábana clínica
- `quality:tramo-d-hemodynamics-gate` — hemodinámica
- `quality:tramo-d-fluid-balance-gate` — balance hídrico
- `quality:tramo-d-ventilation-gate` — ventilación

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
