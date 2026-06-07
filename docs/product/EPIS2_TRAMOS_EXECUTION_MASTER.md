# EPIS2 — Plan maestro tramos A–F

**Fecha:** 2026-06-07 · **Aprobación humana:** OK (sesión autónoma)  
**Higiene:** [`EPIS2_TRAMOS_HYGIENE.md`](./EPIS2_TRAMOS_HYGIENE.md) · gate `quality:tramos-hygiene-gate`

---

## Resumen ejecutivo

| Tramo | Estado | IDC clave | Gate closure |
|-------|--------|-----------|--------------|
| **A** Clínico demostrable | ✅ Cerrado técnico | 21–40 (38 Defer) | `quality:tramo-a-closure-gate` |
| **B** Piloto ambulatorio | ✅ Cerrado técnico (recepción demo) | 2–9 Done; 6,10 Active | `quality:tramo-b-closure-gate` |
| **C** Hospitalización + urgencias | ✅ Cerrado técnico | 111·116·58 Done; 110 Active | `quality:tramo-c-closure-gate` |
| **D** Programas especializados | ✅ Cerrado técnico (UCI demo) | 41–50·135 Active | `quality:tramo-d-closure-gate` |
| **E** Pabellón y anestesia | ✅ Cerrado técnico (OR demo) | 151–160 Active | `quality:tramo-e-closure-gate` |
| **F** APS / medicina general | ◐ Scaffold demo | 121–130 Active | `quality:tramo-f-scaffold-gate` |

**Cadena A–E:** cerrada técnicamente. **Tramo F:** en curso (Ola 12).

---

## Documentación por tramo

| Tramo | Cierre / plan | Inventario |
|-------|---------------|------------|
| A | `EPIS2_TRAMO_A_CLOSURE.md` | Olas 2–3 · 6A |
| B | `EPIS2_TRAMO_B_CLOSURE.md` | `EPIS2_TRAMO_B_RECEPTION_INVENTORY.md` |
| C | `EPIS2_TRAMO_C_CLOSURE.md` | `EPIS2_TRAMO_C_PLAN.md` |
| D | `EPIS2_TRAMO_D_CLOSURE.md` | `EPIS2_TRAMO_D_PLAN.md` · UCI |
| E | `EPIS2_TRAMO_E_CLOSURE.md` | `EPIS2_TRAMO_E_PLAN.md` · OR |
| F | `EPIS2_TRAMO_F_PLAN.md` | `EPIS2_TRAMO_F_APS_INVENTORY.md` |

---

## Workspaces Navigation Rail (8)

`command` · `reception` · `ambulatory` · `emergency` · `icu` · `or` · `quality_iaas` · `admin_system`

Tab APS: `/epis2/dashboard?tab=aps` bajo workspace `ambulatory`.

---

## Próximo paso global

1. Cierre técnico Tramo F (`MF-TRAMO-F-CLOSURE`)
2. Signoff clínico institucional Tramos A–F
3. UCI 131–140 Future · especialidades gráficas

---

## Reportes sesión

| Reporte | Alcance |
|---------|---------|
| `reports/epis2-tramos-hygiene-2026-06-07.md` | Higiene A–E |
| `reports/epis2-tramo-f-start-2026-06-07.md` | Inicio Tramo F APS |

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
