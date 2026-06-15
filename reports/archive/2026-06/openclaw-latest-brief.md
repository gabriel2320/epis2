# OpenClaw EPIS2 Brief

> **Microfase:** auto
> **Modo:** read-only-reviewer (L0)
> **Candados:** safe-run=false · patching=false · git-write=false
> **Generado:** 2026-06-11T12:02:56.472Z

## Restricciones activas

- Read-only reviewer/planner — sin commits, push, ni edits autónomos
- Perfil L0: solo brief/handoff
- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma
- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando

## Git status (sanitized)

```
## master...origin/master
 M reports/epis2-session-close-2026-06-11.md
 M reports/openclaw-latest-brief.md
 M scripts/dev-agent/auto-dev-continuous.mjs
 M scripts/dev-agent/auto-dev-orchestrator.mjs
 M scripts/dev-agent/auto-dev-parallel-launcher.mjs
 M scripts/dev-agent/openclaw-dev-cycle-launcher.mjs
 M scripts/dev-agent/openclaw-handoff.mjs
 M scripts/dev-agent/openclaw-lib.mjs
?? scripts/dev-agent/auto-dev-ledger-lib.mjs
```

## Flags (.env.example keys only — valores no cargados)

```json
{
  "NODE_ENV": "(see .env.example — value not loaded)",
  "API_HOST": "(see .env.example — value not loaded)",
  "API_PORT": "(see .env.example — value not loaded)",
  "DATABASE_URL": "(see .env.example — value not loaded)",
  "VITE_API_BASE_URL": "(see .env.example — value not loaded)",
  "SESSION_SECRET": "(see .env.example — value not loaded)",
  "SESSION_COOKIE_NAME": "(see .env.example — value not loaded)",
  "WEB_ORIGIN": "(see .env.example — value not loaded)",
  "AI_HOST": "(see .env.example — value not loaded)",
  "AI_PORT": "(see .env.example — value not loaded)",
  "OLLAMA_BASE_URL": "(see .env.example — value not loaded)",
  "OLLAMA_MODEL": "(see .env.example — value not loaded)",
  "OLLAMA_DEV_MODEL": "(see .env.example — value not loaded)",
  "OLLAMA_ROUTE_MODE": "(see .env.example — value not loaded)",
  "LOCAL_AI_BASE_URL": "(see .env.example — value not loaded)",
  "VITE_ENABLE_DUAL_CHART_MODES": "(see .env.example — value not loaded)"
}
```

## Agente: Security/PHI Reviewer

- **Skill:** `../openclaw-epis2/workspace/skills/epis2-security-phi-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run check`, `npm run legacy:audit`, `npm run db:validate`

### Archivos a revisar

- `.env.example`
- `docs/product/PRODUCT_INVARIANTS.md`
- `scripts/legacy-audit/detect-duplicate-registries.mjs`
- `scripts/legacy-audit/detect-forbidden-dependencies.mjs`
- `scripts/legacy-audit/detect-legacy-routes.mjs`
- `scripts/legacy-audit/detect-secrets-and-sensitive-data.mjs`
- `scripts/legacy-audit/paths.mjs`
- `scripts/legacy-audit/scan-donor-repositories.mjs`
- `scripts/legacy-audit/validate-import-manifest.mjs`
- `scripts/legacy-audit/validate-quarantine.mjs`
- `docs/legacy/EPIS_POSTMORTEM.md`

## Comandos de verificación sugeridos (humanos / Cursor)

```bash
npm run check
npm run test
npm run architecture:validate
npm run db:validate
```

## Prompt semilla para OpenClaw

Actúa como revisor read-only EPIS2. No modifiques archivos. No ejecutes push/commit/.env.
Microfase objetivo: auto. Revisa los archivos listados y entrega hallazgos en formato handoff.
