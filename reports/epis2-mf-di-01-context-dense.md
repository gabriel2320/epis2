# MF-DI-01 — Contexto clínico denso en ficha

**Fecha cierre:** 2026-06-14 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-context-gate` ✓

---

## Alcance

Franja contextual persistente bajo la banda de identidad del paciente en ficha dual (`/espacio/ficha`), visible en modo tradicional y papel, sin depender de IA local.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `@epis2/clinical-domain` · `clinicalContextDense.ts` | Reglas determinísticas: antigüedad relativa, labs prioritarios, problemas/meds |
| `ClinicalContextDenseStrip.tsx` | UI: problemas, medicamentos, última consulta, labs con «hace X meses» |
| `ClinicalShell` · prop `contextDenseStrip` | Integración capa 2→3 del shell ADR-002 |
| `DualChartPatientPage` | Construye contexto desde longitudinal + clinical-summary |
| `GET /api/patients/:id/context-dense` | API read-only para consumo futuro |
| E2E `g2` · dual-chart-modes | Strip visible con escenario de atención |

## Copy clínico

- Problemas activos · Medicamentos activos · Última consulta (relativa)
- Labs destacados: HbA1c priorizado · valor + antigüedad en español
- Chip episodio abierto · escenario de atención (demo)

## Gates

```bash
npm run quality:di-context-gate
npm run check   # recomendado al cierre sesión
```

## Riesgos / notas

- Datos demo sintéticos: densidad depende de seed longitudinal; escenario siempre visible vía `demoCase.scenario`.
- `oneReadyAtMost`: siguiente MF → **MF-DI-04** (prefill CE-6).

## Próximo paso

`npm run quality:di-next` → **MF-DI-04** Prefill contextual extendido.

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
