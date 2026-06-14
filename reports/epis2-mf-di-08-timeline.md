# MF-DI-08 — Timeline clínico filtrable

**Fecha cierre:** 2026-06-11 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-timeline-gate` ✓ · `npm run check` ✓

---

## Alcance

Timeline agrupado temporalmente (Hoy / Hace 3 meses / Hace 1 año / Anterior) con filtros clínicos en ficha dual — sección Evoluciones.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `timelineClinical.ts` (API) | Filtros labs/firmados/hospitalizaciones/evoluciones + agrupación |
| `chart/timeline/clinicalTimeline.ts` | Misma lógica en web |
| `ClinicalFilterableTimeline.tsx` | UI chips + listas por periodo |
| `TraditionalEvolutionSection.tsx` | Integración en nav evoluciones |
| `DualChartPatientPage.tsx` | «Ver línea de tiempo» → navEvolution |
| E2E `g5` | Smoke dual-chart timeline |
| `quality:di-timeline-gate` | Gate MF-DI-08 |

## Filtros

| Filtro | Criterio |
|--------|----------|
| Laboratorio | `kind === observation` |
| Firmados | `kind === note` |
| Hospitalizaciones | `kind === encounter` |
| Evoluciones | nota evolution o borrador `evolution_note` |

## Gates

```bash
npm run quality:di-timeline-gate
npm run check
```

## Próximo paso

**MF-DI-09** — Microjourneys post-acción (`npm run quality:di-next`).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
