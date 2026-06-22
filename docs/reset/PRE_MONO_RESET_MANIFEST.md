# Pre Mono Reset Manifest

This file records how the old EPIS2 runtime was preserved before the clean
monolith reset.

## Safety Anchors

- Previous active commit: `ade5f4b122505a836fe69c5253846b1dd9144931`
- Reset branch: `codex/epis2-mono-reset`
- Reset commit: `e9bfbf66`
- Safety tag: `epis2-pre-mono-reset`
- Local stash: `pre-mono-reset-cica-local-changes`
- Donor repo: `..\OneEpis`
- Donor commit inspected: `7fd4b9fd902940c99b66fc5c02f9b545267deaeb`

The tag was pushed to origin. The stash is local-only unless explicitly exported
by a human.

## Removed From Active Runtime

- CICA `/app/*`
- legacy `/espacio/*`
- Vite/Fastify/Drizzle EPIS2 runtime
- old `packages/*` package forest
- labs and side services
- historical gates and script catalog
- old database migration chain
- archived report-driven planning surface
- OpenClaw/agent campaign scaffolding

## Preserved

- old code reachable by Git tag;
- local uncommitted CICA work reachable by named stash;
- product lessons summarized in `CICA_DEVELOPMENT_PRESERVATION.md`;
- reset pointers summarized in `EPIS2_LEGACY_POINTERS.md`;
- useful OneEpis architecture patterns copied without mutating OneEpis.

## Policy

Do not copy old runtime code into the active tree. Convert useful learning into
small, tested product behavior only through the current governance ladder.
