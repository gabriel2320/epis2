# EPIS2 — Plan Tramo D (programas especializados)

**Versión:** 1.1 · **Fecha:** 2026-06-07

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
| Hemodinámica | 135 | Build demo | **MF-TRAMO-D-004** ✅ |
| UCI 43–50, 131–134, 136–140 | — | Defer | Planned |
| Pabellón | 121–130 | Defer Ola 12 | — |
| Telemedicina | 95–100 | Defer Ola 9 | — |
| Facturación Chile | 11–20 | Defer Tramo B | Inventario ✅ |

---

## Prerrequisitos

1. Tramo C hospitalización + urgencias ✅ cerrado técnicamente
2. Signoff clínico Tramo A — pendiente institucional
3. Glosario IDC 41/42 reconciliado en árbol — ver inventario

---

## Microfases

| MF | Alcance | Estado |
|----|---------|--------|
| MF-TRAMO-D-001 | Inventario UCI | ✅ |
| MF-TRAMO-D-002 | Rail UCI + tablero IDC 41 | ✅ |
| MF-TRAMO-D-003 | Sábana clínica IDC 42 | ✅ |
| MF-TRAMO-D-004 | Hemodinámica IDC 135 | ✅ |

---

## Gates

- `quality:tramo-d-inventory-gate` — inventario
- `quality:tramo-d-icu-gate` — workspace + tablero
- `quality:tramo-d-flowsheet-gate` — sábana clínica
- `quality:tramo-d-hemodynamics-gate` — hemodinámica

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
