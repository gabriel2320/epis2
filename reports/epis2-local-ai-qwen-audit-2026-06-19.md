# EPIS2 local AI Qwen audit - 2026-06-19

## Executive decision

EPIS2 keeps one AI path:

```text
apps/web
  -> @epis2/ai-client
  -> apps/api/src/ai/routes.ts
  -> services/local-ai HTTP
  -> Ollama local qwen3:8b
  -> Zod validation
  -> API safety/audit
  -> UI draft for human review
```

No parallel AI service, registry, shell, router, or frontend Ollama call was added.

Canonical product boundary remains:

- CICA `/app/*` is active product.
- `/app/buscar` is the active entry.
- `/espacio/*` is frozen legacy fallback.
- AI is local-first, optional, degradable, and never writes final clinical SoT.
- Human review is mandatory for every AI output.
- Default data tier is `L2_phi`; cloud is blocked for `L2_phi`.

## AI-00 audit findings

| Area | Finding | Action |
| --- | --- | --- |
| Runtime | `services/local-ai` already owns Ollama/OpenAI routing; no need for a new service. | Keep and harden. |
| Config | Defaults already target `OLLAMA_BASE_URL=http://127.0.0.1:11434`, `OLLAMA_MODEL=qwen3:8b`, `AI_CLOUD_ENABLED=false`, `AI_DEFAULT_DATA_TIER=L2_phi`. | Added direct config test. |
| Policy | Router is local-first and blocks cloud for `L2_phi`. | Covered by existing and retained tests. |
| Structured output | Draft/textbox/command route output is validated by Zod, but provider-level invalid JSON was previously collapsed into unavailable before draft validation. | Provider now returns public content; draft validator decides `rejected`. |
| Thinking | Ollama chat/generate previously accepted `thinking` as fallback content if public content was empty. | Removed. Thinking-only responses are unavailable and never returned. |
| RLS | Summary route used RLS; RAG and ai_runs reads did not visibly enforce RLS in the route handler. | Wrapped both with `runWithRlsContext`; added boundary test. |
| Audit payload | Draft/textbox/RAG persisted input context too literally in `ai_runs.inputPayload`. | Replaced prompt/text payloads with keys, lengths, and hashes. |
| Certificate assist | Web/command layer mapped `medical_certificate`, but local-ai had no assist schema/prompt for it. | Added fields, prompt, capability, and pattern coverage. |

## Implemented slice

This is a small AI-00/AI-01/AI-02/AI-03 hardening slice:

- `services/local-ai/src/ollama.ts`
  - Uses `/api/chat` first and `/api/generate` fallback.
  - Sends `stream:false`, `format:"json"`, `think:false`.
  - Never returns `message.thinking` or `thinking` as clinical content.
  - Leaves invalid JSON for downstream Zod validation, so generated malformed output becomes `rejected`.

- `services/local-ai/src/clinicalPromptPolicy.ts`
  - Adds the Qwen base policy: local EPIS2 assistant, drafts only, no autonomous diagnosis, no definitive treatment, no signing, no approval, JSON only, limitations, human review.

- `services/local-ai/src/assistSchemas.ts`
- `services/local-ai/src/draftPromptCatalog.ts`
- `services/local-ai/src/assistBlueprintPattern.ts`
- `services/local-ai/src/gatewayCapabilities.test.ts`
  - Adds `medical_certificate` to draft assist support.

- `apps/api/src/ai/routes.ts`
  - Redacts draft/textbox `inputPayload`.
  - Wraps `/api/ai/runs` and `/api/ai/rag/query` clinical reads in RLS context.

- `apps/api/src/ai/rag.ts`
  - Hashes RAG question for `promptHash`.
  - Persists `questionHash` and `questionLength`, not the question text.

- Tests added/updated:
  - default L2/Qwen/cloud-off config
  - thinking-only ignored
  - JSON invalid => `rejected`
  - `requiresHumanReview` false => rejected
  - public `/ready` and `/capabilities`
  - API RLS boundary
  - certificate capability/schema/prompt coverage

## Surface matrix

| AI surface | CICA route | API endpoint | Local-ai contract / Zod | dataTier | Risk | Gate |
| --- | --- | --- | --- | --- | --- | --- |
| Evolution SOAP draft | `/app/pacientes/:patientId/evoluciones/nueva` | `/api/ai/assist/draft` | `localAiDraftAssistOutputSchema` with `evolution_note` | Default `L2_phi` unless explicit | Hallucinated assessment or plan | `assist.test`, `validateOutput.test`, `quality:clinical` |
| Discharge summary draft | `/app/pacientes/:patientId/epicrisis/nueva` | `/api/ai/assist/draft` | `localAiDraftAssistOutputSchema` with `discharge_summary` | Default `L2_phi` | Missing discharge data, unsafe instructions | `assistBlueprintPattern.test`, `quality:clinical` |
| Prescription helper | `/app/pacientes/:patientId/indicaciones/nueva` | `/api/ai/assist/draft` | `localAiDraftAssistOutputSchema` with `prescription` | Default `L2_phi` | Treatment overreach | prompt policy, `requiresHumanReview`, no auto-sign |
| Certificate / clinical text draft | `/app/pacientes/:patientId/documentos/nuevo` | `/api/ai/assist/draft` | `localAiDraftAssistOutputSchema` with `medical_certificate` | Default `L2_phi` | Legal/clinical overclaim | new certificate assist tests |
| Free clinical textbox | CICA/generated form text fields | `/api/ai/assist/textbox` | `localAiTextboxAssistOutputSchema` | Default `L2_phi` by API boundary | Rewriting may add facts | textbox Zod + redacted input audit |
| Patient 24h/period summary | `/app/pacientes/:patientId/resumen` | `/api/ai/suggest/summary` | `aiSummarySuggestResponseSchema` | Default `L2_phi` | Summary omission or stale context | RLS route, `quality:clinical`; AI-04 should add structured local synthesis |
| Exams / trends | `/app/pacientes/:patientId/examenes` | Existing RAG/summary boundary; no new endpoint in this slice | `ragQueryResponseSchema` / future trend schema | Default `L2_phi` | Trend explanation mistaken for diagnosis | AI-05 small PR, RLS required |
| Medication/orders review | `/app/pacientes/:patientId/indicaciones`, `/app/pacientes/:patientId/medicamentos` | `/api/ai/assist/draft` | `prescription`, `pharmacy_validation`, `medication_reconciliation` | Default `L2_phi` | Interaction demo overreach | AI-06 small PR, conservative copy |
| Paper day/book | `/app/pacientes/:patientId/papel/dia/:date`, `/app/pacientes/:patientId/papel/libro` | Existing draft/review boundary; no new endpoint in this slice | Paper draft metadata requires human confirmation | Default `L2_phi` | Paper output treated as signed | AI-07 small PR, no auto-sign |

## Remaining PR sequence

1. `AI-04 patient-summary`: route existing `/api/ai/suggest/summary` through local-ai structured JSON for local synthesis while keeping retrieval-only fallback.
2. `AI-05 patient-exams`: add a narrow trend explanation contract, no diagnosis, no new router.
3. `AI-06 patient-orders-medications`: expose conservative duplicate/allergy/demo interaction notes through existing API and CICA panels.
4. `AI-07 paper-mode`: reuse existing paper draft confirmation model; AI may summarize day/pending items, never sign.

Each PR must preserve:

- no `apps/web -> services/local-ai` import
- no cloud for `L2_phi`
- no prompt PHI plaintext logging
- no `thinking` returned or persisted
- `requiresHumanReview: true`
- Zod-validated output only

## Gate notes

Targeted checks for this slice:

- `npx vitest run services/local-ai/src/config.test.ts services/local-ai/src/ollama.test.ts services/local-ai/src/assist.test.ts services/local-ai/src/localAiAuth.test.ts services/local-ai/src/validateOutput.test.ts services/local-ai/src/gatewayCapabilities.test.ts services/local-ai/src/assistBlueprintPattern.test.ts`
- `npx vitest run apps/api/src/ai/routes.rls.test.ts services/local-ai/src/inference/policy.test.ts services/local-ai/src/inference/router.test.ts`
- `npm run typecheck -w @epis2/local-ai`
- `npm run typecheck -w @epis2/api`

Root gate status in this working tree:

- `npm run quality:fast` passes.
- `npm run check` passes.
- `npm run quality:clinical` passes; it still prints optional missing aliases `quality:microphases` and `dev:velocity:gates`, but exits OK.
- `npm run tool:script -- quality:ai` is cataloged but currently fails because the archived alias points to missing npm script `quality:sh-03-degrade-gate`.
- Direct AI gates pass:
  - `node scripts/quality/validate-sh-03-degrade-gate.mjs`
  - `node scripts/quality/validate-ai-client-gate.mjs`
  - `node scripts/quality/validate-web-ai-boundary-gate.mjs`
  - `node scripts/quality/validate-ai-ext-inference-gate.mjs`
- `npm run quality:required` reaches `npm run test`; visible assertions pass in later retries, but the local Vitest worker exits with native/channel errors (`ERR_IPC_CHANNEL_CLOSED` / `css-tree` loader crash). This is a runner stability issue to isolate separately before using `quality:required` as a merge gate on this workstation.
