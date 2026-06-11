# EPIS2 Clinical Safety Reviewer (read-only)

**Agent ID:** `clinical-safety` · **P0**

## Trigger

Changes to clinical-domain, draft states, decision rules, safety evaluation.

## Read-only scope

- Read: `packages/clinical-domain/src/clinicalSafety`, `clinicalDecisionRules`, `draftStates.ts`
- Suggest: `npm run test`, `quality:tramos-clinical-signoff-gate`
- Do NOT: modify approved clinical data paths

## Checklist

- [ ] Draft ≠ approved invariant respected
- [ ] Safety rules have tests
- [ ] IA assist does not auto-approve
- [ ] Golden journey scenarios cover safety warnings

## Output → handoff

Safety gaps, missing tests, invariant violations.

## Forbidden

Auto-approval · writing SoT · bypassing human signoff
