# EPIS2-07 — IA local segura

**ID:** EPIS2-07  
**Estado:** Completada  
**Fecha:** 2026-06-04

---

## Entregables

| Área | Implementación |
|------|----------------|
| Migración | `005_ai_runs.sql` |
| `services/local-ai` | `POST /assist/draft-suggestion`, validación Zod, frontera sin escritura clínica |
| API proxy | `GET /api/ai/status`, `POST /api/ai/assist/draft` |
| Trazabilidad | `ai_runs` (prompt hash, modelo, latencia, status) |
| Web | Botón «Sugerir con IA (demo)» en formularios de borrador |

---

## Gates

| Criterio | ✓ |
|----------|---|
| Ollama apagado → flujo manual | tests API + assist |
| JSON inválido / auto-aprobación → rechazado | `validateOutput` |
| `ai_runs` con hash y latencia | migración + `recordAiRun` |

---

## Uso local

```bash
docker compose up -d
npm run dev:ai    # :3002
npm run dev:api
# Opcional: ollama pull llama3.2
```

---

## Próximo paso

**EPIS2-08** — Borradores y aprobación (UI + máquina de estados).

---

## Commit sugerido

```text
feat(epis2-07): secure local AI proxy with validated draft assist and ai_runs

Add Ollama-backed draft suggestions via local-ai service, API proxy routes,
schema validation, ai_runs audit table, and optional UI assist without auto-approval.
```
