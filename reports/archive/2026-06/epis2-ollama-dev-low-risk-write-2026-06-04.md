# EPIS2 — Ollama dev: escritura bajo riesgo + documentación

**Fecha:** 2026-06-04  
**Alcance:** Poder acotado para agentes Ollama de desarrollo escribir reportes/docs (Tier L0) con política y gates.

## Entregables

| Artefacto | Rol |
|-----------|-----|
| `EPIS2_DEV_AGENT_LOW_RISK_WRITE.md` | Política Tier L0/L1/X |
| `low-risk-policy.mjs` | Allowlist, validación contenido, `applyLowRiskPatches` |
| `ollama-write.mjs` | `dev:agent:ollama-write` (+ `--apply`, `--document`) |
| `devLowRiskWritePlanSchema` | JSON Ollama con `requiresHumanReview: true` |
| Subagente `ollama-dev-writer` | Prompt + gates dedicados |
| `quality:dev-agent-low-risk-write-gate` | Evidencia estática |

## Tier L0 (auto `--apply`)

- `reports/**` — create/append
- `docs/product/**`, `docs/design/**`

## Prohibido

- API clínica, migraciones, registries, canon (`PRODUCT_INVARIANTS`, `PRODUCT_CANON`)
- Patrones: auto-approve, OpenMRS, SQL SoT, import EPIS

## Uso

```bash
npm run dev:session -- --ollama          # plan sesión (opcional)
npm run dev:agent:ollama-write           # plan parches → reports/dev-agent-ollama-write-plan.json
npm run dev:agent:ollama-write -- --apply   # aplica Tier L0 + npm run check
npm run dev:agent:ollama-write -- --document  # foco reporte sesión
```

Sin auto-commit. Tier L1 (gates, tests, copy) queda en plan para apply manual.

## Gates

```bash
npm run check
npm run test -- --run scripts/dev-agent/low-risk-policy.test.mjs scripts/dev-agent/schemas.test.mjs
npm run quality:dev-agent-low-risk-write-gate
npm run quality:dev-agent-orchestration-gate
```

## Próximo paso

Probar con Ollama up: `npm run dev:agent:ollama-write -- --document --apply --skip-check` solo tras revisar JSON del plan.
