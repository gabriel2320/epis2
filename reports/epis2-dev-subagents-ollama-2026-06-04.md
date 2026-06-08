# EPIS2 — Ollama + subagentes de desarrollo

**Fecha:** 2026-06-04  
**Alcance:** Retomar plan subagentes (arquitecto v2) + integrar Ollama como asistente de planificación dev.

---

## Entregables

| Artefacto | Ruta |
|-----------|------|
| Catálogo 8 subagentes | `docs/product/EPIS2_DEV_SUBAGENTS.md` |
| Orquestación v2 | `docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md` |
| Motor prompts | `scripts/dev-agent/orchestrate.mjs` |
| Plan Ollama JSON | `scripts/dev-agent/ollama-assist.mjs` |
| Schema Zod dev | `scripts/dev-agent/schemas.mjs` |
| Sesión generada | `reports/dev-agent-session.md` |

---

## Dos capas Ollama

| Capa | Comando | Propósito |
|------|---------|-----------|
| **Dev planning** | `npm run dev:agent:ollama` | Plan sesión JSON; no toca SoT |
| **Clínica producto** | `npm run dev:ai` + `ai:evals:live` | Draft assist en borradores |

---

## Subagentes (secuencia Fase B activa)

1. `layers-integrator` — L3+L4+L5
2. `ollama-clinical` — evals assist blueprints
3. `golden-guardian` — journey
4. `gate-runner` — cierre estándar

Tramo clínico añade `tramo-implementer` + `ledger-keeper`.

---

## Comandos

```bash
npm run stack:dev
npm run dev:agent:orchestrate
npm run dev:agent:ollama          # requiere Ollama up
npm run dev:agent:subagent -- --subagent m3-guardian
npm run dev:agent:tramo-k         # compat Semana 4
npm run quality:dev-agent-orchestration-gate
```

---

## Gates

| Gate | Resultado |
|------|-----------|
| `quality:dev-agent-orchestration-gate` | OK |
| Tests schemas + week4 | 5/5 OK |
| `dev:agent:orchestrate` | OK → 4 prompts Fase B |

---

## Próximo paso

Ejecutar sesión Fase B con subagente `layers-integrator`: integrar `ClinicalCommandPalette` (Ctrl+K) en shell global — ver plan Ollama en `reports/dev-agent-ollama-plan.json` si se generó.

---

## Riesgos

1. Ollama dev assist requiere modelo local (`qwen3:8b` por defecto).
2. Subagentes no sustituyen gates humanos ni signoff clínico.
3. Tramo J farmacia sigue bloqueado por canon de olas.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
