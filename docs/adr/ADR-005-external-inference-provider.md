# ADR-005 — Proveedor de inferencia externo (Clinical Inference Gateway)

**Estado:** Aceptado · 2026-06-11 · **Alcance:** `services/local-ai` (draft assist)

## Contexto

EPIS2 exige que la IA clínica sea **opcional**, **trazable** y **nunca escriba SoT**. Hasta ahora solo Ollama local servía borradores estructurados. Se necesita integrar OpenAI (Structured Outputs) para demo L0 sin que web/API llamen cloud directamente ni se relajen invariantes (#11, #15).

## Decisión

1. **Un solo gateway:** `services/local-ai` enruta inferencia; `apps/api` y `apps/web` siguen en `/api/ai/*`.
2. **Modos** (`AI_INFERENCE_MODE`): `ollama` | `openai` | `router` (local first, cloud fallback).
3. **Policy por tier:** `L0_synthetic` y `L1_deidentified` pueden usar cloud si `AI_CLOUD_ENABLED=true` + `OPENAI_API_KEY`. **`L2_phi` bloqueado** (fail-closed) hasta BAA explícito.
4. **Salida:** mismo JSON validado con Zod (`localAiDraftAssistOutputSchema`); OpenAI usa `json_schema` strict alineado al schema.
5. **Trazabilidad:** `ai_runs.outputPayload` incluye `provider` y `dataTier`.

## Consecuencias

- `/ready` OK si Ollama **o** OpenAI operativos (según policy).
- Sin cloud configurado, comportamiento idéntico al baseline Ollama-only.
- Command-route y textbox siguen en Ollama (fase posterior).
- Evals live siguen requiriendo stack local; cloud es opt-in por env.

## Variables de entorno

| Variable | Default | Uso |
|----------|---------|-----|
| `AI_INFERENCE_MODE` | `router` | Cadena de proveedores |
| `AI_CLOUD_ENABLED` | `false` | Habilita OpenAI |
| `AI_DEFAULT_DATA_TIER` | `L0_synthetic` | Tier por defecto |
| `OPENAI_API_KEY` | — | Requerida si cloud |
| `OPENAI_MODEL` | `gpt-4o-mini` | Modelo chat |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | Proxy compatible |
