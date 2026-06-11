# ADR-003 — Modo agenda clínica papel (Paper Planner)

**Estado:** Aceptado · **Fecha:** 2026-06-11  
**Programa:** PROG-PAPER-PLANNER · **Roadmap:** EPIS2-PM-04  
**Prerequisito:** MF-PAPER-02 (campos papel nativos) · estética v1 estable  
**Plan:** [`EPIS2_PAPER_MODE_DEV_PLAN.md`](../product/EPIS2_PAPER_MODE_DEV_PLAN.md) §7

---

## Contexto

Tras PROG-PAPER-MODE, EPIS2 ofrece ficha **documento** I–XIV en `chartMode=paper`. Los médicos también usan **agendas físicas** (día · semana · mes) para pendientes, evoluciones y hitos — independientes del documento longitudinal.

FichaPapel y referencias clínicas chilenas muestran planificadores con líneas horarias y bloques manuscritos, no calendarios dashboard.

---

## Decisión

Adoptar **PROG-PAPER-PLANNER** como programa hermano, con:

1. **Ubicación única:** `apps/web/src/components/chart/paper/planner/` — extender, no `paper-mode/` greenfield.
2. **Superficie dual dentro de paper:** `paperSurface=document|planner` (search param); pestañas **Documento | Agenda** fuera de `.epis2-paper-page`.
3. **Vistas planner:** `day` (MF-PLANNER-00) · `week` (MF-PLANNER-01) · `month` (MF-PLANNER-02) — sin FullCalendar ni DatePicker MUI dentro del área imprimible.
4. **Datos:** encuentros, evoluciones, labs demo/API existentes — **sin SoT nuevo** en MF-PLANNER-00 (datos demo estáticos).
5. **Print:** ruta dedicada MF-PLANNER-03; `@media print` oculta shell dual-chart.

---

## Consecuencias

### Positivas

- Agenda reconocible como hoja clínica, coherente con tokens papel.
- Paralelizable con PROG-PAPER-MODE (paths disjuntos post MF-PAPER-02).
- Base para comandos IA contextuales por vista (MF-PLANNER-04).

### Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Duplicar calendario EMR | Planner ≠ ficha tradicional; solo en `chartMode=paper` |
| Scope API prematuro | MF-00 demo; MF-01+ integración incremental |
| DatePicker MUI en papel | Prohibido ADR — inputs nativos / texto guía |

---

## Microfases

| ID | Entrega | Gate |
|----|---------|------|
| MF-PAPER-PLANNER-00 | ADR-003 + `DailyClinicalPage` demo | `quality:paper-planner-scaffold-gate` |
| MF-PAPER-PLANNER-01 | Semana + algoritmos | `quality:paper-planner-week-gate` |
| MF-PAPER-PLANNER-02 | Mes + markers | `quality:paper-planner-month-gate` |
| MF-PAPER-PLANNER-03 | Print planner + E2E | `quality:paper-planner-print-gate` |
| MF-PAPER-PLANNER-04 | Comandos IA por vista | assist evals |

---

## Aprobación

- [x] MF-PAPER-02 DONE (estética base)
- [x] PROG-PAPER-MODE cerrado
- [ ] Producto valida demo día antes de MF-PLANNER-01

**Frase guía:** *La agenda es papel operativo; la ficha I–XIV es el documento clínico.*
