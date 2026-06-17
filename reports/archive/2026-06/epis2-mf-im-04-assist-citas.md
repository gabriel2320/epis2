# MF-IM-04 — Assist con citas documentales

**Programa:** PROG-STRENGTHEN · PROG-IA-MODERNIZE  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:rag-retrieval-gate`

## Alcance

| Entrega | Detalle |
|---------|---------|
| Retrieval en assist | `resolveAssistDocumentCitations` — DEMO-005 → top-3 secuencial |
| Prompt anclado | `buildDraftAssistPrompt` incluye bloque `Fuentes documentales citadas` |
| Contrato | `AiDocumentCitation` · `documentCitations` en respuesta assist |
| Persistencia | `ai_runs.output_payload.documentCitations[]` con `documentId` + `chunkIndex` |
| Eval sim | `assertSuggestedFieldsGrounded` + `ai:evals:rag-citations` |
| Eval live | `ai:evals:live` exige citas cuando `patientId` = DEMO-005 |

## Evidencia

| Check | Resultado |
|-------|-----------|
| `quality:rag-retrieval-gate` | ✓ IM-03 + IM-04 |
| `assistCitations.test.ts` | ✓ citas + no-hallucination |
| `apps/api/src/ai/routes.test.ts` | ✓ output_payload citas |

## Comandos

```bash
npm run quality:rag-retrieval-gate
npm run ai:evals:rag-citations
npm run ai:evals:live   # requiere dev:ai + Ollama
```

## Próximo paso

**MF-IM-05** — AI Provenance interno (contracts).
