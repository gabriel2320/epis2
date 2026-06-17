# MF-DI-06 — Sugerencias silenciosas (chips CDS)

**Fecha cierre:** 2026-06-11 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-suggestions-gate` ✓ · `npm run check` ✓

---

## Alcance

Pistas clínicas no invasivas en el panel de contexto lateral: alertas CDS/CDR, alergias, exámenes/recetas pendientes, gaps de control HbA1c y PA elevada. Máximo 3 visibles; resto colapsable. Sin modales.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `buildSilentSuggestions.ts` | Ranking determinístico desde alertas + read models |
| `ClinicalCdsCard.tsx` | Variantes info / suggestion / warning (base MF-CU-01) |
| `ClinicalSilentSuggestionsPanel.tsx` | Panel colapsable, máx. 3 chips |
| `useSilentClinicalSuggestions.ts` | Hook web — alertas API + longitudinal |
| `EpisClinicalContextPane` | Integración sobre timeline/documentos |
| `DualChartPatientPage` | Pasa alertas, resumen y labs al context pane |
| E2E g4 | `epis2-clinical-silent-suggestions` en `/espacio/ficha` |

## Tipos de chip (demo)

| Origen | Ejemplo |
|--------|---------|
| Alerta CDS | Reacción cruzada beta-lactámico → conciliación |
| Alergia | Alergia documentada: Penicilina |
| Pendiente | Examen / receta / seguimiento desde `pendingItems` |
| Gap control | HbA1c vencido (DM2) → panel labs |
| Signos vitales | PA ≥ 140 desde resumen |

## Gates

```bash
npm run quality:di-suggestions-gate
npm run check
```

## Próximo paso

**MF-DI-02** — Memoria operacional por usuario (`npm run quality:di-next`).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
