# OpenClaw EPIS2 Brief

> **Microfase:** H-AUTO-6
> **Modo:** max-power-max-power-patch-code (L3)
> **Candados:** safe-run=true · patching=true · git-write=false
> **Generado:** 2026-06-11T03:38:57.571Z

## Restricciones activas

- Read-only reviewer/planner — sin commits, push, ni edits autónomos
- Perfil L3: safe-run allowlist activo
- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma
- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando

## Git status (sanitized)

```
## master...origin/master [ahead 11]
 M docs/quality/auto-dev-6h-ledger.json
 M package.json
 M reports/auto-dev-6h-log.jsonl
 M reports/auto-dev-continuous-log.jsonl
 D reports/auto-dev-continuous.lock
 M reports/auto-dev-orchestrator-log.jsonl
 M reports/auto-dev-parallel-log.jsonl
 M reports/epis2-auto-dev-6h-close-2026-06-10.md
 M reports/epis2-dev-cycle-close-2026-06-11.md
 M reports/epis2-dev-cycle-log.jsonl
 M reports/epis2-dev-cycle-status.json
 M reports/epis2-session-close-2026-06-11.md
 M reports/evolab-open-findings.json
 M reports/openclaw-auto-dev-index.json
 M reports/openclaw-latest-brief.md
 M scripts/dev-agent/auto-dev-continuous.mjs
 M scripts/dev-agent/auto-dev-parallel-launcher.mjs
?? reports/evolab-complement-log.jsonl
?? scripts/dev-agent/evolab-complement.mjs
?? scripts/dev-agent/stop-auto-dev-session.mjs
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

## Agente: Release/Gates Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-release-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run check`, `npm run test`, `npm run quality:local-ci`

### Archivos a revisar

- `package.json`
- `docs/quality/auto-dev-6h-ledger.json`
- `scripts/quality/apply-latest-migration.mjs`
- `scripts/quality/capture-m3-visual-pass.mjs`
- `scripts/quality/dual-chart-ledger-lib.mjs`
- `scripts/quality/dual-chart-next.mjs`
- `scripts/quality/microphase-ledger-lib.mjs`
- `scripts/quality/microphase-next.mjs`
- `scripts/quality/run-dual-chart-plan.mjs`
- `scripts/quality/run-local-ci.mjs`
- `scripts/quality/run-m3-human-pilot.mjs`
- `scripts/quality/run-pilot-trial.mjs`
- `scripts/quality/run-tramos-clinical-signoff-session.mjs`
- `scripts/quality/scaffold-mf-blueprint.mjs`
- `scripts/quality/validate-ai-catalog-smoke-gate.mjs`
- `scripts/quality/validate-ai-tramo-evals-gate.mjs`
- `scripts/quality/validate-auto-dev-6h-gate.mjs`
- … +10 más bajo `scripts/quality`
- `reports/auto-dev-6h-log.jsonl`
- `reports/auto-dev-continuous-log.jsonl`
- `reports/auto-dev-cursor-prompt-tramo-1.md`
- `reports/auto-dev-cursor-prompt-tramo-2.md`
- `reports/auto-dev-cursor-prompt-tramo-3.md`
- `reports/auto-dev-cursor-prompt-tramo-4.md`
- `reports/auto-dev-cursor-queue.jsonl`
- `reports/auto-dev-orchestrator-log.jsonl`
- `reports/auto-dev-parallel-log.jsonl`
- `reports/auto-dev-parallel.lock.json`
- `reports/dev-agent-brief.md`
- `reports/dev-agent-ollama-automation.json`
- `reports/dev-agent-ollama-plan.json`
- `reports/dev-agent-ollama-write-plan.json`
- `reports/dev-agent-prompt-gate-runner.md`
- … +10 más bajo `reports`

## Agente: Golden Journey Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-golden-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run quality:golden-journey`, `npm run test:e2e:ux-g02`

### Archivos a revisar

- `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`
- `e2e/a11y-smoke.spec.ts`
- `e2e/clinical-textbox-evolution-draft.spec.ts`
- `e2e/dual-chart-modes.spec.ts`
- `e2e/golden-command-evolution.spec.ts`
- `e2e/golden-draft-approval.spec.ts`
- `e2e/golden-v2-admission-discharge.spec.ts`
- `e2e/helpers/demoPatient.ts`
- `e2e/login-gateway.spec.ts`
- `e2e/m3-visual-signoff-capture.spec.ts`
- `e2e/m3-visual-signoff.spec.ts`
- `e2e/mobile-drawer.spec.ts`
- `e2e/ola1c-results-journey.spec.ts`
- `e2e/ola2-ambulatory-m3-ui.spec.ts`
- `e2e/ola2-ambulatory-m3-ui.spec.ts-snapshots/ola2-comando-chromium-win32.png`
- `e2e/ola2-ambulatory-m3-ui.spec.ts-snapshots/ola2-medical-certificate-chromium-win32.png`
- … +10 más bajo `e2e`
- `scripts/quality/run-golden-journey.mjs` — *(no encontrado o vacío)*

## Agente: Microphase Ledger Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-ledger-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run quality:microphases`, `npm run quality:microphase-next`

### Archivos a revisar

- `docs/quality/microphase-ledger.json`
- `docs/quality/MICROPHASE_PROGRAM.md`
- `docs/product/EPIS2_TABLERO.md`

## Comandos de verificación sugeridos (humanos / Cursor)

```bash
npm run check
npm run test
npm run architecture:validate
npm run db:validate
```

## Prompt semilla para OpenClaw

Actúa como revisor read-only EPIS2. No modifiques archivos. No ejecutes push/commit/.env.
Microfase objetivo: H-AUTO-6. Revisa los archivos listados y entrega hallazgos en formato handoff.
