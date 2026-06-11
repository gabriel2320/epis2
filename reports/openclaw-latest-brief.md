# OpenClaw EPIS2 Brief

> **Microfase:** H-AUTO-0
> **Modo:** max-power-max-power-patch-code (L3)
> **Candados:** safe-run=true · patching=true · git-write=false
> **Generado:** 2026-06-11T03:12:31.675Z

## Restricciones activas

- Read-only reviewer/planner — sin commits, push, ni edits autónomos
- Perfil L3: safe-run allowlist activo
- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma
- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando

## Git status (sanitized)

```
## master...origin/master [ahead 6]
 M docs/quality/auto-dev-6h-ledger.json
 M package.json
 M reports/auto-dev-6h-log.jsonl
 M reports/auto-dev-orchestrator-log.jsonl
 M reports/auto-dev-parallel-log.jsonl
 M reports/dev-agent-ollama-automation.json
 M reports/dev-agent-ollama-plan.json
 M reports/dev-agent-ollama-write-plan.json
 M reports/epis2-auto-dev-6h-close-2026-06-10.md
 M reports/epis2-dev-cycle-log.jsonl
 M reports/epis2-dev-cycle-status.json
 M reports/evolab-open-findings.json
 M reports/openclaw-auto-dev-index.json
 M reports/openclaw-latest-brief.md
 M reports/openclaw-latest-handoff.md
 M scripts/dev-agent/auto-dev-orchestrator.mjs
 M scripts/dev-agent/auto-dev-parallel-launcher.mjs
 M scripts/dev-agent/auto-dev-preconditions.mjs
 M scripts/dev-agent/openclaw-dev-cycle-launcher.mjs
 M scripts/dev-agent/start-auto-dev-integrated.ps1
?? reports/auto-dev-continuous-log.jsonl
?? reports/auto-dev-continuous.lock
?? scripts/dev-agent/auto-dev-session-lock.mjs
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
- `reports/auto-dev-continuous.lock`
- `reports/auto-dev-cursor-prompt-tramo-1.md`
- `reports/auto-dev-cursor-prompt-tramo-2.md`
- `reports/auto-dev-cursor-prompt-tramo-3.md`
- `reports/auto-dev-cursor-prompt-tramo-4.md`
- `reports/auto-dev-cursor-queue.jsonl`
- `reports/auto-dev-orchestrator-log.jsonl`
- `reports/auto-dev-parallel-log.jsonl`
- `reports/dev-agent-brief.md`
- `reports/dev-agent-ollama-automation.json`
- `reports/dev-agent-ollama-plan.json`
- `reports/dev-agent-ollama-write-plan.json`
- `reports/dev-agent-prompt-gate-runner.md`
- … +10 más bajo `reports`

## Agente: Microphase Ledger Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-ledger-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run quality:microphases`, `npm run quality:microphase-next`

### Archivos a revisar

- `docs/quality/microphase-ledger.json`
- `docs/quality/MICROPHASE_PROGRAM.md`
- `docs/product/EPIS2_TABLERO.md`

## Agente: AI Eval Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-eval-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run quality:ai-tramo-evals-gate`, `npm run ai:evals:live`

### Archivos a revisar

- `docs/product/EPIS2_AI_TRAMO_EVALS.md`
- `scripts/ai` — *(no encontrado o vacío)*
- `packages/clinical-forms/src/blueprints/admission-note.test.ts`
- `packages/clinical-forms/src/blueprints/admission-note.ts`
- `packages/clinical-forms/src/blueprints/allergy-entry.ts`
- `packages/clinical-forms/src/blueprints/clinical-problem-entry.ts`
- `packages/clinical-forms/src/blueprints/discharge-summary.ts`
- `packages/clinical-forms/src/blueprints/evolution-note.ts`
- `packages/clinical-forms/src/blueprints/imaging-request.ts`
- `packages/clinical-forms/src/blueprints/index.ts`
- `packages/clinical-forms/src/blueprints/lab-request.ts`
- `packages/clinical-forms/src/blueprints/medical-certificate.test.ts`
- `packages/clinical-forms/src/blueprints/medical-certificate.ts`
- `packages/clinical-forms/src/blueprints/medication-administration.ts`
- `packages/clinical-forms/src/blueprints/medication-reconciliation.test.ts`
- `packages/clinical-forms/src/blueprints/medication-reconciliation.ts`
- `packages/clinical-forms/src/blueprints/nursing-note.ts`
- … +10 más bajo `packages/clinical-forms/src/blueprints`
- `reports/ai-evals-live-latest.json` — *(no encontrado o vacío)*

## Agente: Clinical Safety Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-clinical-safety-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run test`, `npm run quality:tramos-clinical-signoff-gate`

### Archivos a revisar

- `packages/clinical-domain/src/clinicalSafety/evaluate.test.ts`
- `packages/clinical-domain/src/clinicalSafety/evaluate.ts`
- `packages/clinical-domain/src/clinicalSafety/fromDemoContext.test.ts`
- `packages/clinical-domain/src/clinicalSafety/fromDemoContext.ts`
- `packages/clinical-domain/src/clinicalSafety/rules.ts`
- `packages/clinical-domain/src/clinicalSafety/types.ts`
- `packages/clinical-domain/src/clinicalDecisionRules/evaluate.test.ts`
- `packages/clinical-domain/src/clinicalDecisionRules/evaluate.ts`
- `packages/clinical-domain/src/clinicalDecisionRules/fromSafetyInput.ts`
- `packages/clinical-domain/src/clinicalDecisionRules/rules.test.ts`
- `packages/clinical-domain/src/clinicalDecisionRules/rules.ts`
- `packages/clinical-domain/src/clinicalDecisionRules/toSafetyWarnings.ts`
- `packages/clinical-domain/src/clinicalDecisionRules/types.ts`
- `packages/clinical-domain/src/draftStates.ts`
- `docs/quality/GOLDEN_CLINICAL_JOURNEY.md`

## Comandos de verificación sugeridos (humanos / Cursor)

```bash
npm run check
npm run test
npm run architecture:validate
npm run db:validate
```

## Prompt semilla para OpenClaw

Actúa como revisor read-only EPIS2. No modifiques archivos. No ejecutes push/commit/.env.
Microfase objetivo: H-AUTO-0. Revisa los archivos listados y entrega hallazgos en formato handoff.
