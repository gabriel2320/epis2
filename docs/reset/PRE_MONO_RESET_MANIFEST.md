# Pre Mono Reset Manifest

Reset executed from branch `master` commit `ade5f4b122505a836fe69c5253846b1dd9144931`.

Safety anchors:

- Branch: `codex/epis2-mono-reset`
- Tag: `epis2-pre-mono-reset`
- Stash: `pre-mono-reset-cica-local-changes`
- Donor: `..\OneEpis` commit `7fd4b9fd902940c99b66fc5c02f9b545267deaeb`

Removed from active runtime:

- CICA `/app/*`
- legacy `/espacio/*`
- Vite/Fastify/Drizzle EPIS2 runtime
- package forest under old `packages/*`
- services/labs
- historical gates and scripts
- old database migration chain
- archived report-driven planning surface

Preservation policy:

- The old project is recoverable from `epis2-pre-mono-reset`.
- Local CICA work is recoverable from the named stash.
- Useful product learning is summarized in `CICA_DEVELOPMENT_PRESERVATION.md`.
