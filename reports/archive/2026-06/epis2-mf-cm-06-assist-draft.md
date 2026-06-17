# MF-CM-06 — Assist borrador invocable desde barra

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Gate:** `quality:cm-06-assist-draft-gate` · evidencia live: `ai:evals:live`

## Entregables

| Capa | Cambio |
|------|--------|
| `commandAssistDraft.ts` | Intent→blueprint, stash/consume sessionStorage, guard IA |
| `useClinicalCommandSubmit` | Tras resolve borrador + IA up → `requestDraftAssist` → navega `?assistDraft=1` |
| `useGeneratedFormAiAssist` | Aplica borrador stashed al abrir formulario (sin approve) |
| `ai/routes.ts` | `assistOrigin: command_bar` en `ai_runs` cuando aplica |

## Flujo

1. Usuario: `evolucionar paciente` en barra (paciente fijado)
2. Registry resuelve `create_evolution_draft`
3. Si Ollama up → `POST /api/ai/assist/draft` → `ai_runs` + campos en sessionStorage
4. Navega a `/espacio/evolucion?assistDraft=1&patientId=…`
5. Formulario aplica sugerencia en campos vacíos — humano revisa y guarda borrador

## Degradación

Sin Ollama/local-ai: navegación manual al formulario (sin assist).

## Verificación

```bash
npm run quality:cm-06-assist-draft-gate
npm run stack:dev && npm run dev:ai && npm run ai:evals:live
```

## Próximo

**MF-CM-07** — evals + frases coloquiales ampliadas.
