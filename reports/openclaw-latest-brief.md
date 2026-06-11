# OpenClaw EPIS2 Brief

> **Microfase:** H-AUTO-CYCLE
> **Modo:** read-only-reviewer (L0)
> **Candados:** safe-run=false · patching=false · git-write=false
> **Generado:** 2026-06-11T03:09:29.670Z

## Restricciones activas

- Read-only reviewer/planner — sin commits, push, ni edits autónomos
- Perfil L0: solo brief/handoff
- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma
- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando

## Git status (sanitized)

```
## master...origin/master [ahead 4]
 M reports/auto-dev-6h-log.jsonl
 M reports/auto-dev-orchestrator-log.jsonl
 M reports/auto-dev-parallel-log.jsonl
 M reports/dev-agent-ollama-plan.json
 M reports/epis2-auto-dev-6h-close-2026-06-10.md
 M reports/epis2-dev-cycle-close-2026-06-11.md
 M reports/epis2-dev-cycle-log.jsonl
 M reports/epis2-dev-cycle-status.json
 M reports/evolab-open-findings.json
 M reports/openclaw-auto-dev-index.json
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
  "LOCAL_AI_BASE_URL": "(see .env.example — value not loaded)"
}
```

## Agente: Security/PHI Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-security-phi-reviewer/SKILL.md`
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

## Agente: Architecture/Legacy Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-architecture-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run architecture:validate`, `npm run legacy:validate-manifest`

### Archivos a revisar

- `docs/PRODUCT_CANON.md`
- `legacy-import-manifest.json`
- `docs/legacy/LEGACY_IMPORT_LEDGER.md`
- `scripts/architecture/ai-write-boundary.mjs`
- `scripts/architecture/command-center-home.mjs`
- `scripts/architecture/dev-catalog-gates.mjs`
- `scripts/architecture/explicit-permissions.mjs`
- `scripts/architecture/fhir-export-boundary.mjs`
- `scripts/architecture/human-approval-required.mjs`
- `scripts/architecture/layout-g12-gate.mjs`
- `scripts/architecture/lib/paths.mjs`
- `scripts/architecture/lib/report.mjs`
- `scripts/architecture/lib/scan-sources.mjs`
- `scripts/architecture/main-product-invariants.mjs`
- `scripts/architecture/no-direct-mui-imports.mjs`
- `scripts/architecture/no-legacy-dependencies.mjs`
- `scripts/architecture/single-command-registry.mjs`
- `scripts/architecture/single-epis2-theme.mjs`
- … +8 más bajo `scripts/architecture`

## Comandos de verificación sugeridos (humanos / Cursor)

```bash
npm run check
npm run test
npm run architecture:validate
npm run db:validate
```

## Prompt semilla para OpenClaw

Actúa como revisor read-only EPIS2. No modifiques archivos. No ejecutes push/commit/.env.
Microfase objetivo: H-AUTO-CYCLE. Revisa los archivos listados y entrega hallazgos en formato handoff.
