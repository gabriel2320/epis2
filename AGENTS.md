# EPIS2 Agent Guide

EPIS2 is now a compact full stack clinical cockpit. Keep it small.

## Non-Negotiables

- PostgreSQL through the API is clinical source of truth.
- The UI never signs, approves, or writes final clinical state without API audit.
- AI is optional and cannot sign, approve, or write clinical facts directly.
- No CICA compatibility layer, no legacy `/espacio`, no dashboard as product center.
- Do not add packages, gates, services, registries, or docs unless they remove real complexity.
- Only synthetic development data belongs in the repo.

## Active Surfaces

- `apps/web`: Next.js clinical cockpit.
- `apps/api`: FastAPI clinical API.
- `packages/contracts`: OpenAPI contract exported from the API.
- `infra`: local development infrastructure.
- `docs`: current architecture, safety, and reset notes.

## Gates

- API: `npm run check:api`
- Web: `npm run check:web`
- Contract: `npm run check:contract`
- E2E: `npm run check:e2e`
- Full: `npm run check`
