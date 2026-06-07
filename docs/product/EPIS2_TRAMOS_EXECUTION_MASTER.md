# EPIS2 — Plan maestro tramos A–J

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
| **F** APS / medicina general | ✅ Cerrado técnico (APS demo) | 121–130 Active | `quality:tramo-f-closure-gate` |
| **G** UCI especializada | ✅ Cerrado técnico (UCI 131–140 demo) | 131–140 Active | `quality:tramo-g-closure-gate` |
| **H** IAAS avanzada | ✅ Cerrado técnico (IAAS 141–150 demo) | 141–150 Active | `quality:tramo-h-closure-gate` |
| **I** Especialidades gráficas | ✅ Cerrado técnico (181–190 demo) | 181–190 Active | `quality:tramo-i-closure-gate` |
| **J** Farmacia clínica | ✅ Cerrado técnico (161–170 demo) | 161–170 Active (165 Done core) | `quality:tramo-j-closure-gate` |

**Cadena A–J:** cerrada técnicamente. Signoff clínico institucional pendiente.

---

## Documentación por tramo

| Tramo | Cierre | Inventario / plan |
|-------|--------|-------------------|
| A | `EPIS2_TRAMO_A_CLOSURE.md` | Olas 2–3 · 6A |
| B | `EPIS2_TRAMO_B_CLOSURE.md` | `EPIS2_TRAMO_B_RECEPTION_INVENTORY.md` |
| C | `EPIS2_TRAMO_C_CLOSURE.md` | `EPIS2_TRAMO_C_PLAN.md` |
| D | `EPIS2_TRAMO_D_CLOSURE.md` | `EPIS2_TRAMO_D_PLAN.md` · UCI |
| E | `EPIS2_TRAMO_E_CLOSURE.md` | `EPIS2_TRAMO_E_PLAN.md` · OR |
| F | `EPIS2_TRAMO_F_CLOSURE.md` | `EPIS2_TRAMO_F_PLAN.md` · APS |
| G | `EPIS2_TRAMO_G_CLOSURE.md` | `EPIS2_TRAMO_G_PLAN.md` · UCI especializada |
| H | `EPIS2_TRAMO_H_CLOSURE.md` | `EPIS2_TRAMO_H_PLAN.md` · IAAS avanzada |
| I | `EPIS2_TRAMO_I_CLOSURE.md` | `EPIS2_TRAMO_I_PLAN.md` · especialidades gráficas |
| J | `EPIS2_TRAMO_J_CLOSURE.md` | `EPIS2_TRAMO_J_PLAN.md` · farmacia clínica |

---

## Próximo paso global

1. Signoff clínico institucional Tramos A–J
2. `quality:golden-journey` antes de piloto hospitalario
3. Piloto institucional · calidad/auditoría 171–180

---

## Reportes sesión

| Reporte | Alcance |
|---------|---------|
| `reports/epis2-tramo-i-closure-2026-06-07.md` | Cierre Tramo I especialidades |
| `reports/epis2-tramo-j-closure-2026-06-07.md` | Cierre Tramo J farmacia clínica |

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
