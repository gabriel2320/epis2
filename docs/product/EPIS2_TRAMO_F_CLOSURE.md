# EPIS2 — Cierre Tramo F (scaffold APS)

**MF-TRAMO-F-CLOSURE** · **Fecha:** 2026-06-07  
**Canon:** [`EPIS2_TRAMO_F_PLAN.md`](./EPIS2_TRAMO_F_PLAN.md) · [`EPIS2_TRAMO_F_APS_INVENTORY.md`](./EPIS2_TRAMO_F_APS_INVENTORY.md)

---

## Resultado declarado

```text
Tab APS ambulatorio → PSCV → Framingham → EMP → pie diabético → salud mental → niño sano → PNI → prenatal → derivación → visita domiciliaria
```

**Estado:** ✅ **Cerrado técnicamente** (scaffold demo IDC 121–130). Signoff clínico pendiente.

**Invariante:** home canónico = Centro de Comando — tablero APS no es home.

---

## Microfases cerradas (F-001 … F-011)

| MF | Alcance | IDC |
|----|---------|-----|
| MF-TRAMO-F-001 | Inventario APS | 121–130 |
| MF-TRAMO-F-002 | Tablero + control cardiovascular | 121 Active |
| MF-TRAMO-F-003 | Calculadora Framingham | 122 Active |
| MF-TRAMO-F-004 | Examen medicina preventiva | 123 Active |
| MF-TRAMO-F-005 | Pie diabético | 124 Active |
| MF-TRAMO-F-006 | Tamizaje salud mental | 125 Active |
| MF-TRAMO-F-007 | Control niño sano | 126 Active |
| MF-TRAMO-F-008 | Calendario PNI | 127 Active |
| MF-TRAMO-F-009 | Control prenatal | 128 Active |
| MF-TRAMO-F-010 | Derivación ministerial | 129 Active |
| MF-TRAMO-F-011 | Visita domiciliaria | 130 Active |

---

## Gates obligatorios Tramo F

| Gate | Evidencia |
|------|-----------|
| `quality:tramo-f-inventory-gate` | Inventario + plan |
| `quality:tramo-f-aps-gate` | Tab APS + IDC 121 |
| `quality:tramo-f-scaffold-gate` | IDC 122–130 |
| `quality:tramo-f-audit-gate` | Navigation tree |
| `quality:tramo-f-closure-gate` | Este documento |

---

## Próximo tramo global

Cadena **A–F** cerrada técnicamente — signoff clínico institucional · UCI 131–140 Future · especialidades gráficas.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
