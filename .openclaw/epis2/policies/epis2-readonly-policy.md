# EPIS2 read-only policy (L0)

Perfil **L0** — sesión manual / Cursor sin auto-dev.

## Allowed (L0)

- Read files under agent scope paths
- Suggest gates (`npm run check`, `architecture:validate`, etc.)
- Generate brief/handoff artifacts in `.agent-runs/openclaw/` and `reports/openclaw-latest-*.md`
- Sanitize secrets in output (never echo `.env` values)

## Forbidden (L0 + L1)

- Commits, push, branch operations (OpenClaw; PM-03 git sigue vía `EPIS2_AUTO_DEV_AUTHORIZED`)
- Writing or modifying source files autonomously (`EPIS2_OPENCLAW_PATCHING_ENABLED=false`)
- Loading `.env` or echoing secrets (`EPIS2_OPENCLAW_READ_ENV=false`)
- Auto-approving clinical data or signatures
- Import from `../Epis` without `legacy-import-manifest.json`
- OpenMRS, Carbon, dashboard-as-home patterns
- Second Command/Form Registry «temporal»

## L1 auto-dev (ver epis2-auto-dev-locks.md)

- `EPIS2_OPENCLAW_SAFE_RUN=true` — ejecuta solo comandos en allowlist
- Post handoff: `openclaw:verify-tramo` corre gate del tramo si allowlisted

## Human-in-the-loop

OpenClaw → brief/handoff [→ safe-run gates en L1] → Cursor → human review → gates → commit
