# MF-DI-05 — Panel acciones probables en ficha

**Fecha cierre:** 2026-06-11 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-suggestions-gate` ✓ · `npm run check` ✓

---

## Alcance

Mostrar 3–5 acciones clínicas probables al abrir la ficha tradicional, ranked por escenario (ambulatorio / hospitalizado / urgencia), borradores pendientes, alertas activas y foco crónico DM2/HTA — sin IA local ni segundo Command Registry.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `probableActions.ts` | Matriz por escenario, boosts contextuales, overrides DM2/HTA |
| `ClinicalProbableActionsPanel.tsx` | Wrapper `EpisCommandSuggestionCards` en resumen ficha |
| `PatientClinicalSummaryGrid.tsx` | Integración panel bajo resumen clínico |
| `DualChartPatientPage.tsx` | Wiring chips + submit vía `classicCommand` |
| `validate-di-suggestions-gate.mjs` | Gate MF-DI-05 |
| `dual-chart-modes.spec.ts` g3 | E2E panel visible en `/espacio/ficha` |

## Comportamiento

| Escenario | Acciones base (top 5) |
|-----------|------------------------|
| Ambulatorio | Evolución, receta, lab, certificado, interconsulta |
| Hospitalizado | Evolución, procedimiento, bandeja resultados, imagen, alta |
| Urgencia | Evolución, nota enfermería, lab, problema, interconsulta |

Boosts: borradores → evolución; alertas → bandeja resultados; DM2/HTA → frases «control diabetes», panel labs, renovar receta.

## Gates

```bash
npm run quality:di-suggestions-gate
npm run check
```

## Próximo paso

**MF-DI-06** — Sugerencias silenciosas CDS (chips receta por vencer, examen pendiente, gaps control) — `npm run quality:di-next`.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
