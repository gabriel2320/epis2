# MF-IM-02 — Embed vía Ollama (contrato)

**Programa:** PROG-STRENGTHEN-2026 / PROG-IA-MODERNIZE  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:im-02-embed-gate`

## Alcance

- Contrato `embedDocument` en `@epis2/contracts` (`RAG_EMBED_DIM=384`, `nomic-embed-text`)
- Endpoint `POST /embed/document` en `local-ai`
- Proxy API `POST /api/ai/embed/document`
- Smoke live: `npm run ai:embed-smoke`

## Evidencia

| Check | Resultado |
|-------|-----------|
| `packages/contracts/src/rag.ts` | ✓ request/response Zod |
| `runEmbedDocument` + unit test | ✓ mock Ollama |
| `gatewayCapabilities.embedDocument` | ✓ cuando Ollama up |
| `ai:embed-smoke` | ✓ con stack dev + dev:ai |

## Comandos

```bash
npm run build -w @epis2/contracts
npm run quality:im-02-embed-gate
npm run ai:embed-smoke   # live
npm run check
```

## Próximo paso

**MF-IM-03** — RAG incremental (retrieval secuencial) · `quality:rag-retrieval-gate`.
