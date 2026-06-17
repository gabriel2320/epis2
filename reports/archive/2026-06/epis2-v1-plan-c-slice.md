# EPIS2 — Plan C slice: documentos + RAG pgvector

**Fecha:** 2026-06-05  
**Alcance:** Primera sesión Plan C (V1 completo) — intake, pgvector, export, journey V1 CI.

---

## Entregables

| # | Entregable | Estado |
|---|------------|--------|
| C1 | Pipeline intake `POST /api/patients/:id/documents/intake` | ✓ |
| C2 | OCR opcional demo (`ocr_pending` sin sidecar) | ✓ |
| C3 | RAG pgvector — chunks + búsqueda semántica + fallback keyword | ✓ |
| C4 | Export resumen imprimible `GET .../export/summary` (text/plain) | ✓ |
| C5 | Observaciones en timeline longitudinal | ✓ (ya existía) |
| C6 | `golden-v1-longitudinal-review` en `quality:golden-journey` | ✓ |

---

## Infra

- Docker/CI: imagen `pgvector/pgvector:pg16`
- Migraciones: `019_v1_pgvector_documents.sql`, `020_v1_document_chunks_seed.sql`

---

## UI

- `DocumentSearchPanel`: intake demo + hint búsqueda semántica
- `PatientLongitudinalPanel`: botón exportar resumen

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | 209 passed, 11 skipped (sin DATABASE_URL local) |
| `npm run db:validate` | OK — 20 migraciones |

**Nota:** recrear Postgres con `docker compose up -d` (imagen `pgvector/pgvector:pg16`) antes de `db:migrate`.

---

## Pendiente (Plan C completo)

- PDF binario real (librería o servicio)
- OCR worker productivo (Tesseract/sidecar)
- Embeddings Ollama `nomic-embed-text` cuando IA local up
- Checklist humano journey V1 §3 en piloto

---

## Próximo paso

**Plan D** (V2 hospitalización operativa) o cerrar PDF/OCR en Plan C fase 2.
