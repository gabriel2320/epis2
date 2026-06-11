# EPIS2 AI Eval Reviewer (read-only)

**Agent ID:** `eval` · **P1**

## Trigger

Blueprint assist, Ollama evals, AI tramo changes.

## Read-only scope

- Read: `docs/product/EPIS2_AI_TRAMO_EVALS.md`, `scripts/ai`, blueprint definitions
- Suggest: `quality:ai-tramo-evals-gate`, `ai:evals:live`
- Do NOT: run live evals without `dev:ai` stack

## Checklist

- [ ] Eval cases cover assist flows
- [ ] Structured output gates pass
- [ ] No PHI in eval fixtures
- [ ] Ollama model documented in brief

## Output → handoff

Eval gaps, regression risks, model/config issues.
