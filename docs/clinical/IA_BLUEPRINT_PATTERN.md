# EPIS2 — Patrón IA Ollama por blueprint

**Microfase:** MF-188  
**Invariante:** IA no escribe SoT; solo borradores con `requiresHumanReview: true`.

---

## Tres artefactos por blueprint con assist

| Artefacto | Ubicación | Contenido |
|-----------|-----------|-----------|
| Campos assist | `services/local-ai/src/assistSchemas.ts` | `ASSIST_BLUEPRINT_FIELDS[blueprintId]` |
| Prompt clínico | `services/local-ai/src/draftPromptCatalog.ts` | `DRAFT_PROMPT_CATALOG` entry |
| Validación | `services/local-ai/src/assistBlueprintPattern.ts` | `assertAssistBlueprintPattern()` |

---

## Checklist al añadir blueprint

1. `draftType` en API = `blueprintId` snake_case.
2. Entrada en `ASSIST_BLUEPRINT_FIELDS` con lista de field IDs del formulario.
3. Entrada en `DRAFT_PROMPT_CATALOG` con `taskTitle`, `taskDetail`, `fieldHints` en español.
4. UI: botón `epis2-ai-suggest` en `GeneratedClinicalFormPage` (ya cableado por blueprint).
5. Tests: `assistBlueprintPattern.test.ts` + `ai:evals` si el blueprint es crítico.

---

## Blueprints con patrón completo hoy

`evolution_note`, `discharge_summary`, `prescription`, `lab_request`, `nursing_note`, `medication_administration`, `pharmacy_validation`.

Blueprints sin IA (explícito N/A): `patient_search`, `patient_summary`, `referral`, `imaging_request`.

---

## Evaluación CI

```bash
npm run ai:evals   # 5 casos sintéticos — sin Ollama en CI
npm run ai:smoke   # opcional local — requiere stack Ollama
```
