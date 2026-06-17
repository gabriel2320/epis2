# EPIS2 V5 — IA clínica trazable (slice demo)

**Fecha:** 2026-06-04  
**Permiso:** `ai.read` (todos los roles clínicos + auditor)

## Entregables

| Área | Detalle |
|------|---------|
| **API** | `GET /api/ai/runs`, `POST /api/ai/rag/query`, `POST /api/ai/suggest/summary` |
| **Trazabilidad** | Cada consulta registra fila en `ai_runs` |
| **RAG** | Búsqueda documental + respuesta con `citations[]` (retrieval; síntesis si Ollama up) |
| **Resumen 24 h** | Agregado desde longitudinal; sin persistir nota |
| **UI** | `PatientClinicalAiPanel` en ficha longitudinal |
| **Límites** | Sin SQL, sin auto-aprobación, sin nota final desde IA |

## Verificación

```bash
npm run db:migrate
npm test
```

Integración: `apps/api/src/v5/v5.integration.test.ts`

## Fuera de alcance (gate V5 completo)

- Intent NL en Centro de Comando
- RAG pgvector / embeddings
- Evals sintéticas automatizadas
- Prompts versionados en BD

## Journey

`golden-v5-ai-traceable` en [EPIS2_GOLDEN_JOURNEYS.md](../docs/quality/EPIS2_GOLDEN_JOURNEYS.md)
