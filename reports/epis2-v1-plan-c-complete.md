# EPIS2 — Plan C completo (V1 documentos + RAG)

**Fecha:** 2026-06-05  
**Estado:** cerrado (demo)

## Entregables

| # | Entregable | Estado |
|---|------------|--------|
| C1 | Pipeline intake documentos | ✓ |
| C2 | OCR demo (`POST .../ocr`, sin sidecar) | ✓ |
| C3 | RAG pgvector + embeddings Ollama opcional | ✓ |
| C4 | Export PDF + TXT (`?format=pdf`) | ✓ |
| C5 | Observaciones en timeline | ✓ |
| C6 | Journey V1 en CI | ✓ |

## API clave

- `POST /api/patients/:id/documents/intake`
- `POST /api/patients/:id/documents/:docId/ocr`
- `GET /api/patients/:id/export/summary?format=pdf|txt`
- Búsqueda semántica en `documents/search`

## Próximo

Plan D — hospitalización operativa (`reports/epis2-v2-plan-d-slice.md`).
