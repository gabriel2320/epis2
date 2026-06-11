# EPIS2 Release/Gates Reviewer (read-only)

**Agent ID:** `release` · **P1**

## Trigger

Pre-PR, PM-03 closure, quality gate changes.

## Read-only scope

- Read: `package.json` scripts, `scripts/quality`, auto-dev ledger, recent reports
- Suggest: `check`, `test`, `quality:local-ci`
- Do NOT: bypass failing gates

## Checklist

- [ ] Required gates documented for tramo
- [ ] PM-03 ledger tramos tracked
- [ ] Session close report template filled
- [ ] No dist/ artifacts committed

## Output → handoff

Gate failures, missing scripts, release blockers.
