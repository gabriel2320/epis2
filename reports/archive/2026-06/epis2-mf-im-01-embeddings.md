# MF-IM-01 — Embeddings pgvector 384d

**Programa:** PROG-STRENGTHEN-2026 / PROG-IA-MODERNIZE  
**Fecha:** 2026-06-14  
**Gate:** `npm run db:validate`

## Alcance

- Columna `embedding_384 vector(384)` en `clinical_document_chunks` (migración **046** — ledger citaba 042, número ya ocupado en repo)
- Lectura dual: búsqueda prioriza 384d, fallback legacy 128d
- Intake/OCR escriben ambas columnas
- Script batch demo: `npm run db:reindex-chunks`

## Evidencia

| Check | Resultado |
|-------|-----------|
| Migración 046 + test SQL | ✓ |
| `demoEmbedText384` + pool 128→384 | ✓ unit |
| Búsqueda semántica demo hemoglobina | ✓ integration |
| `db:validate` | ✓ |

## Comandos

```bash
npm run db:migrate
npm run db:reindex-chunks
npm run db:validate
npx vitest run apps/api/src/clinical/embeddings.test.ts
npx vitest run apps/api/src/clinical/documents.chunk-search.integration.test.ts
```

## Próximo paso

**MF-IM-02** — contrato embed vía Ollama (`nomic-embed-text`) · smoke embed.
