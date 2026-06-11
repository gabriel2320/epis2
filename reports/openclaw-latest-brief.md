# OpenClaw EPIS2 Brief

> **Microfase:** H-AUTO-CYCLE
> **Modo:** read-only-reviewer (L0)
> **Candados:** safe-run=false · patching=false · git-write=false
> **Generado:** 2026-06-11T03:03:21.718Z

## Restricciones activas

- Read-only reviewer/planner — sin commits, push, ni edits autónomos
- Perfil L0: solo brief/handoff
- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma
- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando

## Git status (sanitized)

```
## master...origin/master [ahead 1]
MM .env.example
M  .gitignore
A  .openclaw/epis2/README.md
A  .openclaw/epis2/policies/epis2-forbidden-actions.md
AM .openclaw/epis2/policies/epis2-readonly-policy.md
A  .openclaw/epis2/skills/epis2-architecture-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-clinical-safety-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-eval-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-golden-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-ledger-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-release-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-security-phi-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-ux-reviewer/SKILL.md
M  docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md
 M docs/product/EPIS2_EVOLAB_INTEGRATION.md
AM docs/product/EPIS2_OPENCLAW_INTEGRATION.md
MM docs/product/EPIS2_PM03_AUTO_ORCHESTRATION.md
MM docs/quality/auto-dev-6h-ledger.json
MM package.json
MM reports/auto-dev-6h-log.jsonl
M  reports/auto-dev-cursor-prompt-tramo-1.md
M  reports/auto-dev-cursor-prompt-tramo-3.md
M  reports/auto-dev-cursor-queue.jsonl
MM reports/auto-dev-orchestrator-log.jsonl
MM reports/auto-dev-parallel-log.jsonl
MM reports/dev-agent-brief.md
MM reports/dev-agent-ollama-automation.json
MM reports/dev-agent-ollama-write-plan.json
MM reports/epis2-auto-dev-6h-close-2026-06-10.md
A  reports/epis2-integrated-dev-resume-2026-06-11.md
MM reports/evolab-open-findings.json
AM reports/openclaw-latest-brief.md
 M scripts/dev-agent/auto-dev-6h-runner.mjs
MM scripts/dev-agent/auto-dev-orchestrator.mjs
 M scripts/dev-agent/auto-dev-parallel-launcher.mjs
 M scripts/dev-agent/auto-dev-preconditions.mjs
M  scripts/dev-agent/brief.mjs
 M scripts/dev-agent/generate-auto-dev-cursor-prompt.mjs
A  scripts/dev-agent/openclaw-brief.mjs
AM scripts/dev-agent/openclaw-handoff.mjs
AM scripts/dev-agent/openclaw-lib.mjs
M  scripts/dev-agent/session.mjs
 M scripts/dev-agent/start-auto-dev-6h.ps1
 M scripts/dev-agent/start-auto-dev-integrated.ps1
 M scripts/quality/validate-evolab-bridge-gate.mjs
AM scripts/quality/validate-openclaw-gate.mjs
MM scripts/quality/validate-pm03-orchestration-gate.mjs
?? .openclaw/epis2/policies/README.md
?? .openclaw/epis2/policies/epis2-auto-dev-locks.md
?? docs/product/EPIS2_DEV_CYCLE_OPENCLAW.md
?? reports/epis2-dev-cycle-log.jsonl
?? reports/epis2-dev-cycle-status.json
?? reports/epis2-pm03-orchestrator-close-2026-06-11.md
?? reports/epis2-session-close-2026-06-11.md
?? reports/openclaw-auto-dev-index.json
?? scripts/dev-agent/dev-cycle-sync.mjs
?? scripts/dev-agent/openclaw-dev-cycle-launcher.mjs
?? scripts/dev-agent/openclaw-dev-cycle.mjs
?? scripts/dev-agent/openclaw-policy-check.mjs
?? scripts/dev-agent/openclaw-policy.mjs
?? scripts/dev-agent/openclaw-post-tramo.mjs
?? scripts/dev-agent/openclaw-safe-patch.mjs
?? scripts/dev-agent/openclaw-safe-run.mjs
?? scripts/dev-agent/openclaw-sync.mjs
?? scripts/dev-agent/openclaw-tramo.mjs
?? scripts/dev-agent/openclaw-verify-tramo.mjs
?? scripts/dev-agent/start-auto-dev-full-cycle.ps1
?? scripts/quality/validate-openclaw-cycle-gate.mjs
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
