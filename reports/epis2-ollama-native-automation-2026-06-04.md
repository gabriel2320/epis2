# EPIS2 — Automatización Ollama nativa (dev)

**Fecha:** 2026-06-04  
**Alcance:** probe nativo, pipeline `ollama-auto`, integración `dev:session`, gates y docs.

---

## Qué se entregó

| Pieza | Rol |
|-------|-----|
| `scripts/ollama/native-client.mjs` | `probeOllamaNative`, `ensureOllamaReady`, `getOllamaStatus`, `getOllamaEnv` |
| `scripts/ollama/probe.mjs` | CLI `npm run ollama:probe` |
| `scripts/dev-agent/ollama-automation.mjs` | Pipeline probe → plan → write L0 |
| `scripts/dev-agent/session.mjs` | Flag `--ollama-auto` (+ `--apply`) |
| `scripts/quality/validate-dev-agent-ollama-automation-gate.mjs` | Gate estructura |

**Scripts npm:**

```bash
npm run ollama:probe
npm run dev:agent:ollama-auto
npm run dev:agent:ollama-auto -- --apply
npm run dev:session -- --ollama-auto
npm run dev:session -- --ollama-auto --apply
npm run quality:dev-agent-ollama-automation-gate
```

---

## Flujo

1. **Probe** — `/api/tags`; valida modelo (`OLLAMA_MODEL`, default `qwen3:8b`).
2. **Plan** — `ollama-assist.mjs` → `reports/dev-agent-ollama-plan.json`.
3. **Write** — `ollama-write.mjs --document` (dry-run o `--apply` Tier L0).

Artefacto resumen: `reports/dev-agent-ollama-automation.json`.

---

## Gates

- `quality:dev-agent-ollama-automation-gate`
- `quality:dev-agent-orchestration-gate` (ampliado)
- Cierre estándar: `npm run check`, `npm run test`, `npm run db:validate`

---

## Riesgos

- Ollama apagado o modelo sin pull → fallo explícito con hint (`ai:enable`, `ai:pull-model`).
- `--apply` solo Tier L0 (`reports/`, `docs/product/`, `docs/design/`); sin commit automático.
- No sustituye assist clínico (`dev:ai` / `local-ai`).

---

## Próximo paso

1. Revisar planes generados y diff L0 antes de commit humano.
2. Commit consolidado (Ollama + Fase C L2/L3 + low-risk write + automation) si el usuario lo pide.
3. Ola 3 roadmap: comandos `revisa medicamentos` / `ver pendientes`.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
