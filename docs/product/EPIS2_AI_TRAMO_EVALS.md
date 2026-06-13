# EPIS2 — IA producto en el loop (Semana 3)

**Versión:** 1.1 · **Tramo activo:** K (calidad 171–180)

---

## Evals Ollama por tramo

| Tramo | Blueprints assist |
|-------|---------------------|
| K | `evolution_note`, `nursing_note`, `discharge_summary` |
| J | `pharmacy_validation`, `medication_reconciliation`, `prescription` |
| I | `outpatient_visit`, `referral_report`, `evolution_note` |
| … | ver `scripts/ai-tramo-blueprints.mjs` |

```bash
npm run dev:ai
npm run ai:evals:tramo-k
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

---

## Cierre de tramo (Semana 4)

```bash
npm run ai:evals:tramo-k   # tramo activo
npm run ai:evals:closure   # EPIS2_AI_EVALS_LIVE=all
```

---

## MF-CASE-10 — Evals assist con casos SIM

Matriz piloto `SIM_ASSIST_EVAL_MATRIX` en `@epis2/test-fixtures` (tier `L0_synthetic`, sin PHI).

| Comando | Uso |
|---------|-----|
| `npm run quality:case-intel-assist-gate` | Matriz + golden v6 (CI, sin Ollama) |
| `npm run ai:evals:sim` | Live assist por caso SIM (requiere `dev:ai`) |

Golden journey API: `golden-v6-sim-assist` — paciente `EPIS2-SIM`, comando evolución y frontera `/api/ai/assist/draft` con `requiresHumanReview: true`.

Salida live: `reports/ai-evals-sim-latest.json`

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
