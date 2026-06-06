# EPIS2 — Canon de ejecución por olas (v1)

**Fecha:** 2026-06-04  
**Origen:** Revisión estratégica 8/10 — consolidación olas 0–20  
**Entregable:** [`docs/product/EPIS2_WAVE_EXECUTION_CANON.md`](../docs/product/EPIS2_WAVE_EXECUTION_CANON.md)

---

## Decisiones incorporadas

| # | Ajuste solicitado | Acción |
|---|-------------------|--------|
| 1 | Olas no lineales estrictas | §2 vocabulario + precedencia vs paralelismo |
| 2 | Ola 1 sobrecargada | Milestones **1A–1D** sin renumerar |
| 3 | `ambulatory` demasiado ancho | §4 dominios/paquetes + regla de frontera |
| 4 | Urgencias ≠ ambulatorio | Workspace **`emergency`** planificado; Ola 10 |
| 5 | FHIR tarde | Modelo FHIR-aligned olas **0–3**; Ola 20 = avanzada |
| 6 | Seguridad transversal | Ola 0 = baseline; checklist continuo §6 |
| 7 | DEFERRED vs prioridad | Cuatro campos Estado/Prioridad/Horizonte/Decisión §5 |
| 8 | Hospitalización general | Tramo C + Ola 11 renombrada conceptualmente |
| 9 | Ola 6 mixta | Capas 6A–6D + motor documental desde 1–3 |
| — | Tramos A–D | §9 secuencia operacional real |
| — | Gates ampliados | §10 nueve capas |
| — | Métricas cuádruple | §11 progreso por ola |

---

## Estado EPIS2 vs canon (snapshot)

| Tramo | Estado |
|-------|--------|
| A — Core demostrable | **En curso** — Ola 0 ✓, 1A ✓, 2 activa, 3 pendiente |
| B — Piloto institucional | Planned |
| C — Hosp + urgencias | Planned |
| D — Especialidades | Future / Defer |

**Próxima MF recomendada (Tramo A):** Ola 3 antecedentes + 6A motor documental/impresión.

---

## Gates sesión (canon doc only)

| Gate | Resultado |
|------|-----------|
| `npm run check` | No requerido — solo docs |
| Coherencia con `PRODUCT_INVARIANTS.md` | OK |
| Contradicción arquitectura | Ninguna |

---

## Riesgos

1. Implementar workspace `emergency` en código antes de Ola 10 — mantener solo en canon hasta MF dedicada.
2. Declarar Ola 2 **Done** sin signoff clínico — métrica §11 lo impide.
3. Roadmap legacy (`EPIS2_COMPLETION_ROADMAP.md` v1.0) puede desincronizarse — usar canon como fuente primaria.

---

## Próximo paso

Alinear `EPIS2_INVENTORY_WORKSPACE_MATRIX.md` y registrar `emergency` + `inpatient` en `clinicalWorkspaceRegistry.ts` cuando abra MF Ola 10 / Tramo C.
