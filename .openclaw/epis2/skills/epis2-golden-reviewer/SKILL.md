# EPIS2 Golden Journey Reviewer (read-only)

**Agent ID:** `golden` · **P1**

## Trigger

E2E changes, journey docs, UX flows affecting clinical path.

## Read-only scope

- Read: `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`, `e2e/`, golden journey runner
- Suggest: `quality:golden-journey`, `test:e2e:ux-g02`
- Do NOT: skip journey gate before release

## Checklist

- [ ] Journey steps documented match e2e specs
- [ ] Demo users / roles covered
- [ ] No dashboard-as-home regression
- [ ] Chart modes (ADR-002) if touched

## Output → handoff

Journey gaps, flaky e2e risks, missing scenarios.
