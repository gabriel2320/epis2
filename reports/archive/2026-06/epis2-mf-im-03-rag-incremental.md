# MF-IM-03 — RAG incremental (retrieval secuencial)

**Programa:** PROG-STRENGTHEN-2026 / PROG-IA-MODERNIZE  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:rag-retrieval-gate`

## Alcance

- Retrieval secuencial por chunk en `services/local-ai/src/rag/`
- Fixture `DEMO-005` con ≥3 chunks indexables en `@epis2/test-fixtures`
- Gate `validate-rag-retrieval-gate.mjs` (top-3 chunks demo-005)

## Evidencia

| Check | Resultado |
|-------|-----------|
| `retrieveChunksSequential` + `runSequentialRagRetrieval` | ✓ |
| `assembleRagContext` citas `[n]` | ✓ |
| Fixture `DEMO_005_RAG_CHUNKS` | ✓ |
| Unit test top-3 alergia penicilina | ✓ |
| `quality:rag-retrieval-gate` | ✓ |

## Comandos

```bash
npm run build -w @epis2/test-fixtures
npm run quality:rag-retrieval-gate
npx vitest run services/local-ai/src/rag/sequentialRetrieval.test.ts
npx vitest run packages/test-fixtures/src/demoRagChunks.test.ts
```

## Próximo paso

**MF-IM-04** — Assist con citas documentales · `quality:rag-retrieval-gate` + eval no-hallucination.
