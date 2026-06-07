# EPIS2 — IA producto en el loop (Semana 3)

**Versión:** 1.0 · **Tramo activo:** J (farmacia 161–170)

---

## Evals Ollama por tramo

| Tramo | Blueprints assist |
|-------|---------------------|
| J | `pharmacy_validation`, `medication_reconciliation`, `prescription` |
| I | `outpatient_visit`, `referral_report`, `evolution_note` |
| … | ver `scripts/ai-tramo-blueprints.mjs` |

```bash
npm run dev:ai
npm run ai:evals:tramo-j
npm run ai:catalog-assist-smoke
```

Variables: `EPIS2_AI_EVALS_TRAMO=J` · `EPIS2_AI_EVALS_MAX_LATENCY_MS=90000`

---

## Métricas (salida)

Tras `ai:evals:live` → `reports/ai-evals-live-latest.json`:

| Métrica | Uso |
|---------|-----|
| `p95LatencyMs` | SLA assist local Qwen3:8b |
| `validJsonRate` | Contrato Zod / frontera JSON |
| `passRate` | Blueprints con success o rejected policy |

---

## Catálogo visual + assist

- Ruta: `/desarrollo/catalogo-visual` (dev / `VITE_ENABLE_VISUAL_THEME_CATALOG`)
- Smoke: `npm run ai:catalog-assist-smoke`
- E2E: `npm run test:e2e:week3`

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
