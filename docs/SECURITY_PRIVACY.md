# Security and Privacy

EPIS2 is development software. It is not certified clinical software and must
not receive real patient data.

## Data Policy

- Use synthetic patients only.
- Do not commit PHI, national identifiers, production logs, dumps, screenshots
  with real data, clinical documents, or secrets.
- Treat demo credentials as local-only development data.
- Keep generated test screenshots out of Git.

## Auth

- Keep `EPIS2_AUTH_ENABLED=true` outside local-only experiments.
- Change `EPIS2_AUTH_SECRET` before any shared environment.
- Replace `EPIS2_AUTH_LOCAL_USERS` before any shared environment.
- `EPIS2_AUTH_ALLOW_DEV_ACTOR_HEADER=true` is development-only and must never be
  used outside local testing.

## Audit

- Every clinical write must pass through the API.
- Every clinical write must emit an audit event.
- Audit events must include actor context when auth is enabled.
- UI state alone is not an audit record.

## AI Boundary

- AI providers are optional and local-first.
- AI may suggest text or summaries, but cannot sign, approve, or write final
  clinical facts directly.
- Do not send clinical data to third parties without explicit safety review.
- If AI is unavailable, the core clinical workflow must still work.

## Database

- PostgreSQL is the source of truth.
- Alembic is the schema migration path.
- Do not bypass the API for product behavior.
- Do not commit local database volumes, dumps, or generated fixtures from real data.

## Dependency Audit

`npm audit --omit=dev` currently reports a moderate PostCSS advisory through
Next.js 16.2.9's internal `postcss@8.4.31` dependency.

Current decision:

- npm reports 16.2.9 as the latest stable Next.js release in this workspace.
- Root `postcss` is overridden to a patched version for the rest of the tree.
- Do not run `npm audit fix --force` for this finding because it proposes a
  breaking downgrade to Next 9.
- Re-check when a newer stable Next.js release is available.
