# MF-IM-08 — Anti feedback-loop (policy assist)

**Programa:** PROG-STRENGTHEN · PROG-IA-MODERNIZE · fase 8  
**Fecha:** 2026-06-14  
**Gate:** `npm run ai:evals:feedback-loop` (offline) · `npm run ai:evals:live` (opcional)

## Alcance

| Entrega | Detalle |
|---------|---------|
| Política RAG | `filterAssistEligibleCandidates` excluye chunks `aiastTagged` antes de retrieval |
| Tag canónico | `EPIS2_AIAST_CONTEXT_TAG = 'AIAST'` |
| Wiring assist | `assistCitations.ts` filtra candidatos DEMO-005 antes de `runSequentialRagRetrieval` |
| Prompt | `buildAntiFeedbackLoopPolicy()` en `buildClinicalInferencePolicy` |
| Fixture | `getDemo005AiastAllergyChunk()` — trampa alta similitud alergia + `aiastTagged: true` |
| Eval offline | `ai:evals:feedback-loop` → vitest policy + citas |

## Evidencia

| Check | Resultado |
|-------|-----------|
| `assistContextPolicy.test.ts` | ✓ 4 tests — AIAST excluido aunque score > chunks normales |
| `assistCitations.test.ts` | ✓ 4 tests — regresión MF-IM-08 en pipeline citas |
| `npm run ai:evals:feedback-loop` | ✓ 8/8 tests |
| `npm run check` | ✓ lint + typecheck + architecture:validate |
| `npm run ai:evals:live` | ✓ 4/4 blueprints · citas DEMO-005 |

## Comandos

```bash
npx vitest run services/local-ai/src/rag/assistContextPolicy.test.ts services/local-ai/src/rag/assistCitations.test.ts
npm run ai:evals:feedback-loop
npm run ai:evals:live   # requiere dev:ai + Ollama
npm run check
```

## Próximo paso

**MF-IM-09** — OTel spans pipeline IA.
