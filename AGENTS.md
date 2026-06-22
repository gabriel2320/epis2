# EPIS2 Agent Guide

EPIS2 is now a compact full stack clinical cockpit. Keep it small, clinical,
auditable, and easy to correct.

## Read First

Before editing, read:

1. `README.md`
2. `docs/GOVERNANCE.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DEVELOPMENT_PLAN.md`
5. `docs/SCREEN_TREE.md`

Read `docs/reset/*` only for reset context or legacy forensics.

## Non-Negotiables

- PostgreSQL through the API is the clinical source of truth.
- The UI never signs, approves, or writes final clinical state without API audit.
- AI is optional and cannot sign, approve, or write clinical facts directly.
- Only synthetic development data belongs in the repo.
- No CICA compatibility layer, no legacy `/espacio`, no dashboard as product center.
- No new package, gate, service, registry, or doc unless it removes real complexity.

## Active Surfaces

- `apps/web`: Next.js clinical cockpit.
- `apps/api`: FastAPI clinical API.
- `packages/contracts`: OpenAPI contract exported from the API.
- `infra`: local PostgreSQL development stack.
- `docs`: current architecture, governance, safety, and reset notes.

## Feature Admission

No clinical module enters core unless it has:

- persisted model or explicit existing model ownership;
- schema/request/response shape;
- endpoint;
- minimal screen or visible workflow;
- audit behavior for writes;
- focused test coverage.

If a feature does not belong to patient, ficha, SOAP/evolucion, audit, print,
permissions, or optional AI, keep it out.

## Forbidden Work

- Reviving CICA routes, registries, generated route derivation, or `/app/buscar`.
- Re-adding `/espacio`, dashboard home, three modes, labs, or old campaign gates.
- Importing old EPIS2 code in bulk from the safety tag or stash.
- Mutating `..\OneEpis`; it is a read-only donor reference.
- Adding placeholder routes or invisible future scaffolds.

## Gates

- API: `npm run check:api`
- Web: `npm run check:web`
- Contract and anti-legacy surface: `npm run check:contract`
- E2E smoke: `npm run check:e2e`
- Full: `npm run check`

Legacy local Git hooks are not source of truth. If a local hook points to a
deleted legacy script, run the official gates and fix the local hook outside the
tracked product tree; do not recreate old scripts to satisfy it.
