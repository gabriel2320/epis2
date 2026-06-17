# EPIS2 — Modelos Ollama código (dev)

**Fecha:** 2026-06-04

---

## Modelos cuantizados (registry Ollama)

| Tag | ~Tamaño | Uso |
|-----|---------|-----|
| `qwen2.5-coder:7b` | 4.7 GB | Rápido · planes JSON · parches L0 |
| `qwen2.5-coder:14b` | 9 GB | **Recomendado dev** (RTX 5070) |
| `deepseek-coder-v2:16b` | 9 GB | TypeScript/React fuerte |
| `deepseek-coder:6.7b` | 4 GB | Fallback ligero |

Clínica producto **no cambia**: `OLLAMA_MODEL=qwen3:8b` (`local-ai`, evals, assist).

---

## Comandos

```bash
npm run ai:pull-coder-models
npm run ai:pull-coder-models -- --only qwen2.5-coder:14b
npm run ollama:probe
```

`.env`:

```env
OLLAMA_MODEL=qwen3:8b
OLLAMA_DEV_MODEL=qwen2.5-coder:14b
```

Dev-agent (`ollama-assist`, `ollama-write`, `ollama-auto`) usa `OLLAMA_DEV_MODEL`.

---

## Gates

- `quality:dev-agent-ollama-automation-gate` incluye `ai:pull-coder-models`
- `validate-dev-env-gate` sigue exigiendo `OLLAMA_MODEL=qwen3:8b` (clínica)

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
