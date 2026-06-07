# EPIS2 CE-4 — Slots ampliados + prefill contextual (evolución/epicrisis)

**Fecha:** 2026-06-04  
**Alcance:** CE-4 — enriquecer extracción de slots y prefill desde resumen activo del paciente  
**Depende de:** CE-3b (slot prefill en formularios)

## Objetivo

Completar el arco command-first: la frase del Power Bar aporta más señal clínica (`clinicalReasonHint`, `noteHint`) y, al abrir evolución o epicrisis con paciente activo, el formulario recibe un borrador inicial desde el resumen longitudinal demo — sin auto-aprobación.

## Entregables

| Área | Cambio |
|------|--------|
| `CommandSlots` | `clinicalReasonHint`, `noteHint` (registry + contracts) |
| `extractSlots` | «por/motivo…», «evolución: …», «nota: …» |
| `command-slot-prefill` | Motivo → lab/interconsulta/imagen; nota → evolución |
| `context-clinical-prefill` | Resumen → campos SOAP / epicrisis |
| `GeneratedClinicalFormPage` | `mergePrefillOnlyEmpty` al cargar paciente |
| Web search | Propagación de nuevos slots en URL |
| Tests | `slots.test.ts`, `context-clinical-prefill.test.ts`, ampliación CE-3b |

## Mapeo contextual (resumen → formulario)

| Resumen | Evolución | Epicrisis |
|---------|-----------|-----------|
| `relevantLabs` + `recentEvents` | `objective` | `hospitalizationSummary` |
| `activeProblems` | `assessment` | `diagnoses` |
| `pendingItems` + medicación | `plan` | `instructions`, `followUpPlan` |
| `activeMedications` | (en plan) | `dischargeMedications` |

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK (497 tests) |
| `npm run db:validate` | OK |

## Riesgos

- Prefill contextual depende de `clinicalContext.summaryFields` demo; producción real requerirá SoT longitudinal.
- `clinicalReasonHint` heurístico puede capturar ruido en frases largas — revisión humana obligatoria.

## Próximo paso

- **UX-G02 manual:** Centro de Comando → «solicitar hemograma por fiebre» → confirmar → ver lab prefilled; evolución con paciente DEMO-005 → campos SOAP sugeridos.
- **CE-5 (opcional):** indicador UI «borrador sugerido por comando» + limpiar slots de URL tras aplicar.
