# EPIS2 — Integración Ollama (limpieza + respuestas)

**Fecha:** 2026-06-04  
**Alcance:** Parser JSON robusto, chat API + think:false, alineación dev-agent y local-ai.

## Problema

Modelos Qwen (`qwen3:8b`) devolvían respuestas difíciles de parsear:

- Bloques `think` antes del JSON
- Fences markdown ` ```json `
- Respuestas vacías cuando `think` consumía `num_predict`
- `validateCommandRouteOutput` hacía `JSON.parse` directo (fallaba en CE-3)
- `dev:agent:ollama` fallaba con el mismo patrón

## Cambios

| Área | Archivo | Mejora |
|------|---------|--------|
| Parser clínico | `services/local-ai/src/extractOllamaJson.ts` | strip think/markdown + extracción JSON balanceada |
| Cliente Ollama | `services/local-ai/src/ollama.ts` | `/api/chat` → fallback `/api/generate`, `think: false`, errores API |
| Validadores | `validateOutput.ts`, `validateCommandRouteOutput.ts` | Usan `parseJsonFromOllamaText` |
| Dev-agent | `scripts/ollama/json-from-response.mjs`, `ollama-client.mjs` | Misma lógica que local-ai |
| Plan dev | `schemas.mjs`, `ollama-assist.mjs` | `parseDevSessionPlanFromOllamaText`, prompt dinámico por fase |
| Gate | `validate-ollama-structured-output-gate.mjs` | Exige parser + chat + think:false |

## Gates

```bash
npm run check
npm run test -- --run services/local-ai scripts/dev-agent/schemas.test.mjs
npm run quality:ollama-structured-output-gate
```

## Riesgos

- Modelos sin soporte `think` ignoran el flag (comportamiento previo).
- Ollama local sigue siendo opcional; app clínica funciona sin IA.

## Próximo paso

Probar con stack local: `npm run ai:enable` → `npm run dev:agent:ollama` y asistencia en formulario clínico.
