# EPIS2 — Signoff clínico PROG-DUAL-CHART

**Programa:** PROG-DUAL-CHART · **Fecha:** 2026-06-10  
**ADR:** [ADR-002-dual-chart-modes.md](../adr/ADR-002-dual-chart-modes.md) — **Aceptado**

---

## Alcance cerrado (MF-00…09)

| Fase | Entrega | Gate |
|------|---------|------|
| MF-00 | Scaffold ADR + ClinicalShell | `dual-chart-scaffold-gate` |
| MF-01 | Paridad EMR tradicional | `dual-chart-traditional-gate` |
| MF-02 | Papel SoT Carta/A5 | `dual-chart-paper-sot-gate` |
| MF-03 | Router `/espacio/ficha` | `dual-chart-router-gate` |
| MF-04 | Shell v2 (4 capas) | `dual-chart-shell-anatomy-gate` |
| MF-05 | TraditionalEhrLayout 17 secciones | `dual-chart-traditional-layout-gate` |
| MF-06 | PaperChartLayout v2 | `dual-chart-paper-layout-gate` |
| MF-07 | Legacy freeze classic/dashboard | `dual-chart-legacy-freeze-gate` |
| MF-08 | Census-first post-login | `dual-chart-census-gate` |
| MF-09 | Invariante #6 + signoff | `dual-chart-launcher-gate` |

---

## Criterios clínicos verificados

1. **Ficha médica real primero** — superficie institucional; IA en panel colapsable.
2. **Dos modos canónicos** — `chartMode=traditional` | `chartMode=paper`; sin A4 en papel.
3. **SoT PostgreSQL** — borradores ≠ aprobados; IA no firma ni aprueba.
4. **Flujo** — Login → censo/búsqueda → ficha → selector modos.
5. **Legacy congelado** — classic/dashboard deprecados; redirect suave a ficha dual.

---

## Invariante #6 (enmienda)

> Home = búsqueda/censo de pacientes; workspace principal = ficha dual (`/espacio/ficha`).

Command Center queda como **launcher delgado** (búsqueda + recientes), no hero operacional.

---

## Riesgos residuales

- Wiring completo Guardar/Firmar en barra clínica — iteración post-signoff.
- Redirect automático `/comando` → censo solo con flag `VITE_ENABLE_DUAL_CHART_MODES`.

---

## Aprobación

| Rol | Estado | Fecha |
|-----|--------|-------|
| Producto / arquitectura | Signoff técnico MF-09 | 2026-06-10 |
