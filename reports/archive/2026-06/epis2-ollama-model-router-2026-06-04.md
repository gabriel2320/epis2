# EPIS2 — Enrutado Ollama por estación y función

**Fecha:** 2026-06-04

---

## Comportamiento

| Función | Uso | Modelo |
|---------|-----|--------|
| `clinical` | `local-ai`, assist borradores | `qwen3:8b` (fijo, gate) |
| `dev-plan` | `ollama-assist`, plan JSON sesión | coder ligero |
| `dev-write` | `ollama-write`, docs L0 | coder según tier |

**Tier estación** (auto-detect o override):

| Tier | Criterio | dev-write preferido |
|------|----------|---------------------|
| minimal | &lt;16 GB RAM o &lt;8 GB VRAM | `qwen2.5-coder:7b` |
| standard | 16+ GB RAM, 8+ GB VRAM | `qwen2.5-coder:14b` |
| performance | 48+ GB RAM, 12+ GB VRAM | `deepseek-coder-v2:16b` |

Si falta el modelo preferido → **fallback** al siguiente candidato instalado.

---

## Comandos

```bash
npm run ollama:route
npm run ollama:route -- --json   # → reports/ollama-model-routes.json
npm run ollama:probe             # incluye tabla de rutas
```

## Variables `.env`

```env
OLLAMA_ROUTE_MODE=auto          # auto | fixed
EPIS2_WORKSTATION_TIER=performance
EPIS2_WORKSTATION_VRAM_GB=12
OLLAMA_ROUTE_DEV_PLAN=qwen2.5-coder:7b
OLLAMA_ROUTE_DEV_WRITE=deepseek-coder-v2:16b
OLLAMA_DEV_MODEL=...            # solo si OLLAMA_ROUTE_MODE=fixed
```

---

## Archivos

- `scripts/ollama/workstation-profile.mjs` — RAM/VRAM/tier
- `scripts/ollama/model-router.mjs` — candidatos + selección
- `scripts/ollama/route.mjs` — CLI

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
