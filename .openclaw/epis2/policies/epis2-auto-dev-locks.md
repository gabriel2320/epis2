# EPIS2 OpenClaw — MAX POWER auto-dev (L3)

Forzado por defecto en `start-auto-dev-6h.ps1` e `start-auto-dev-integrated.ps1` (`EPIS2_OPENCLAW_MAX_POWER=1`).

## Perfil L3 (máximo permitido en EPIS2)

| Capacidad | Estado |
|-----------|--------|
| Brief/handoff por tramo | ✓ |
| `openclaw:safe-run` gates allowlist + `quality:*` | ✓ |
| Comandos condicionales (ollama-auto, e2e, evolab) | ✓ con `AUTHORIZE_CONDITIONAL` |
| `openclaw:safe-patch` L0 (reports, docs/product, docs/design) | ✓ |
| `openclaw:safe-patch` L1 (scripts/quality, scripts/dev-agent) | ✓ con `AUTHORIZE_CODE` |
| Post-tramo: verify + ollama-auto + sync | ✓ |

## Candados env

| Variable | Valor | Efecto |
|----------|-------|--------|
| `EPIS2_OPENCLAW_MAX_POWER` | `1` | Activa defaults L3 |
| `EPIS2_OPENCLAW_POWER_LEVEL` | `L3` | patch-code-limited |
| `EPIS2_OPENCLAW_PATCHING_ENABLED` | `true` | safe-patch activo |
| `EPIS2_OPENCLAW_SAFE_RUN` | `true` | ejecutar gates |
| `EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL` | `true` | ollama/e2e/evolab |
| `EPIS2_OPENCLAW_AUTHORIZE_CODE` | `true` | parches L1 |
| `EPIS2_OPENCLAW_REQUIRE_HUMAN_APPROVAL` | `true` | handoffs → humano |
| `EPIS2_OPENCLAW_GIT_WRITE` | `false` | git solo PM-03 |
| `EPIS2_OPENCLAW_READ_ENV` | `false` | solo `.env.example` |

## L4 (opcional — solo verificación)

`EPIS2_OPENCLAW_POWER_LEVEL=L4` — safe-run ampliado (`test:e2e:*`, `dev:agent:*`, `dev:auto:*`) **sin** safe-patch.

## Prohibido (L5 / invariantes)

- Coder autónomo sin humano
- `git commit` / `git push` desde OpenClaw
- Auto-aprobación clínica · escritura SoT PostgreSQL
- Import EPIS sin manifest · OpenMRS/Carbon
- Lectura `.env` real

```bash
npm run openclaw:policy
npm run openclaw:safe-patch -- --proposal .agent-runs/openclaw/patch-proposal.json
npm run openclaw:post-tramo -- --tramo 2
```
