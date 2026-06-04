# Adaptación — epis-ai-prompts → local-ai

**Origen:** `packages/epis-ai-prompts` (EPIS)

**Destino:**

- `services/local-ai/src/clinicalPromptPolicy.ts` — preamble, reglas, inferencia
- `services/local-ai/src/draftPromptCatalog.ts` — 4 blueprints MVP
- `services/local-ai/src/prompt.ts` — ensamblaje JSON assist

## No portado

- `rag-query-v1`, `extract-problems-v1`, prompts OpenMRS/contextSummaryText obligatorio
- Registry completo de 11 prompts EPIS

## Contrato

Salida sigue siendo `localAiDraftAssistOutputSchema` (JSON campos + safetyNotes).
