# EPIS2 CE-3b — Prefill de formularios desde CommandSlots

**Fecha:** 2026-06-04  
**Alcance:** CE-3b — slots del comando → campos iniciales del formulario clínico  
**Depende de:** CE-2 (slots enriquecidos), CE-3 (assist route)

## Objetivo

Cuando un comando resuelve a un formulario (`/espacio/*`), los `CommandSlots` extraídos de la frase del Power Bar se propagan a la URL y se mapean a campos del blueprint como **borrador editable**. El usuario sigue revisando y confirmando; no hay auto-aprobación.

## Entregables

| Área | Cambio |
|------|--------|
| `packages/clinical-forms` | `buildCommandSlotPrefill(blueprintId, slots)` — lab, receta, interconsulta, imagenología, búsqueda |
| `apps/web` | `ClinicalFormSearch`, `parseClinicalFormSearch`, `formSearchFromCommandSlots` |
| Navegación | `navigateClinicalCommandResult` incluye slots en `search` |
| Router | `validatePatientSearch` → `parseClinicalFormSearch` |
| `GeneratedClinicalFormPage` | seed inicial = slots + defaults de resumen |
| Tests | `command-slot-prefill.test.ts`, `navigateClinicalCommandResult.test.ts`, `clinicalNavigate.test.ts` |

## Mapeo MVP

| Slot | Blueprints | Campo(s) |
|------|------------|----------|
| `medicationHint` | prescription | `medication` |
| `studyHint` | lab_request | `labTests` |
| `studyHint` + `bodySiteHint` | imaging_request | `studyDescription`, `modality`, `clinicalIndication` |
| `specialtyHint` | referral | `specialty` |
| `urgencyHint` | lab_request, imaging_request, referral | `priority` / `urgency` |
| `patientHint` | patient_search | `patientName` |

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK (488 tests) |
| `npm run db:validate` | OK |

## Riesgos

- Slots en query string pueden quedar visibles en historial del navegador (solo hints clínicos, no PHI aprobada).
- Mapeo parcial: evolución, epicrisis y otros blueprints sin prefill aún — extensible en CE-4.

## Próximo paso

- Validación manual UX-G02 (Centro de Comando + frases con slots)
- CE-4: prefill evolución/epicrisis desde contexto activo + ampliar suite de slots
