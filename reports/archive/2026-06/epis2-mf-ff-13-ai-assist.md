# MF-FF-13 — IA asistiva + degraded E2E

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 4  
**Gate:** `quality:sh-03-degrade-gate` ✓ · `ai:evals:sim` (requiere `npm run dev:ai`)

---

## Alcance

App operativa sin Ollama; assist degrada sin bloquear formularios ni comando clínico.

## Verificación

| Gate | Resultado |
|------|-----------|
| `quality:sh-03-degrade-gate` | ✓ 17 tests (form degrade, API routes, ai-client contract) |
| `ai:evals:sim` | Pendiente live — requiere `stack:dev` + `dev:ai` en puerto 3002 |

## Cambios indirectos (wave 4)

Frontera `@epis2/ai-client` permite que web degrade vía HTTP sin embebir local-ai.

## Próximo paso

**MF-FF-14** — MedRepo knowledge-pack loader (wave 5).
