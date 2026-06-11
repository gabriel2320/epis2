# AI-EXT — Clinical Inference Gateway (ADR-005)

**Fecha:** 2026-06-11  
**Alcance:** `services/local-ai`, `apps/api/src/ai`, `packages/contracts`

## Objetivo

Integrar OpenAI como proveedor opcional de borradores estructurados sin romper invariantes: un solo gateway (`local-ai`), policy L0/L1 vs L2, trazabilidad en `ai_runs`.

## Entregables

- Módulo `services/local-ai/src/inference/*` (policy, router, ollama/openai providers)
- `AI_INFERENCE_MODE` / `AI_CLOUD_ENABLED` / `OPENAI_*` en config
- `runDraftAssist` enrutado vía `generateWithInferenceRouter`
- `/ready` y `/capabilities` multi-proveedor
- Contratos y `/api/ai/status` enriquecidos (`inferenceMode`, `cloud.openai`, `activeProvider`)
- `provider` + `dataTier` en respuesta assist y `ai_runs.outputPayload`

## Gates

```bash
npm run build -w @epis2/local-ai
npm run quality:ai-ext-inference-gate
```

## Riesgos

- L2_phi bloqueado a cloud hasta BAA — fail-closed en policy
- Command-route y textbox aún solo Ollama
- `ai:evals:live` requiere stack (`npm run stack:dev` + `dev:ai`)

## Próximo paso

MF-CM-07 (evals + frases coloquiales) o extender router a command-route/textbox si se prioriza paridad cloud.
