# EPIS2 Governance

EPIS2 was reset to avoid becoming inflated again. The default answer to new
surface area is no until it passes this document.

## Complexity Budget

- One web app.
- One API.
- One OpenAPI contract.
- One local PostgreSQL stack.
- Five official gates: API, web, contract, e2e, full.
- No package forest. `packages/contracts` is the only package allowed by default.

## Forbidden Growth

- No CICA revival.
- No `/espacio` compatibility layer.
- No dashboard as home.
- No historical gates catalog.
- No old labs or services attached to core.
- No second command or form registry.
- No placeholder routes in the visible product tree.
- No broad helper folders without domain ownership.
- No bulk import from `epis2-pre-mono-reset`, old stash, or `..\OneEpis`.

## Feature Ladder

Before adding anything, all answers must be yes:

1. Does it belong to patient, ficha, SOAP/evolution, audit, print, permissions, or optional AI?
2. Does the backend own the clinical truth?
3. Does it have a minimal human workflow?
4. Does it have a persisted model or a clear existing model owner?
5. Does it have schema, endpoint, screen, and test coverage?
6. Can an existing module absorb it without a new abstraction?

If any answer is no, keep it out of core.

## Dependency Rules

- Prefer standard library, framework primitives, and existing modules.
- Add a dependency only when it removes real complexity.
- Do not add runtime services for experiments.
- Do not add packages unless there are multiple real consumers and a stable boundary.

## Documentation Rules

- Update docs when behavior, setup, routes, gates, or boundaries change.
- Do not add campaign docs, archival indexes, or speculative plans to active docs.
- Keep reset forensics under `docs/reset`.
- Keep docs actionable; delete or rewrite stale instructions.

## Gate Definitions

- `check:api`: ruff and pytest for FastAPI.
- `check:web`: typecheck, eslint, and Next build.
- `check:contract`: anti-legacy runtime validation plus OpenAPI export diff.
- `check:e2e`: Playwright clinical smoke flow.
- `check`: all official gates.

No other gate becomes required without replacing this governance document.

## Review Questions

Use these questions for any PR:

- Did this make the product smaller or clearer?
- Does it preserve clinical auditability?
- Did it introduce another way to do the same thing?
- Can a future maintainer remove or correct it quickly?
- Would this have prevented the old EPIS2 inflation pattern?
