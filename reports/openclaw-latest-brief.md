# OpenClaw EPIS2 Brief

> **Microfase:** H-AUTO-2
> **Modo:** max-power-max-power-patch-code (L3)
> **Candados:** safe-run=true · patching=true · git-write=false
> **Generado:** 2026-06-11T03:11:25.005Z

## Restricciones activas

- Read-only reviewer/planner — sin commits, push, ni edits autónomos
- Perfil L3: safe-run allowlist activo
- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma
- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando

## Git status (sanitized)

```
## master...origin/master [ahead 5]
 M docs/product/EPIS2_DEV_CYCLE_OPENCLAW.md
 M reports/auto-dev-6h-log.jsonl
 M reports/auto-dev-orchestrator-log.jsonl
 M reports/auto-dev-parallel-log.jsonl
 M reports/dev-agent-brief.md
 M reports/dev-agent-ollama-automation.json
 M reports/dev-agent-ollama-plan.json
 M reports/dev-agent-ollama-write-plan.json
 M reports/dev-agent-prompt-gate-runner.md
 M reports/dev-agent-prompt-golden-guardian.md
 M reports/dev-agent-prompt-ledger-keeper.md
 M reports/dev-agent-prompt-ollama-clinical.md
 M reports/epis2-auto-dev-6h-close-2026-06-10.md
 M reports/epis2-continuous-dev-active-2026-06-11.md
 M reports/epis2-dev-cycle-close-2026-06-11.md
 M reports/epis2-dev-cycle-log.jsonl
 M reports/epis2-dev-cycle-status.json
 M reports/evolab-open-findings.json
 M reports/openclaw-auto-dev-index.json
 M reports/openclaw-latest-brief.md
 M scripts/dev-agent/auto-dev-parallel-launcher.mjs
 M scripts/dev-agent/auto-dev-preconditions.mjs
 M scripts/dev-agent/openclaw-handoff.mjs
?? reports/openclaw-latest-handoff.md
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

## Agente: UX/M3 Reviewer

- **Skill:** `.openclaw/epis2/skills/epis2-ux-reviewer/SKILL.md`
- **Gates sugeridos (solo lectura):** `npm run quality:ui-simplify-gate`, `npm run quality:three-modes-gate`

### Archivos a revisar

- `apps/web/src/admin/BlueprintStudioPanel.tsx`
- `apps/web/src/api/adminApi.ts`
- `apps/web/src/api/aiApi.ts`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/api/client.ts`
- `apps/web/src/api/clinicalApi.ts`
- `apps/web/src/api/commandApi.ts`
- `apps/web/src/api/dashboardApi.ts`
- `apps/web/src/api/opsApi.ts`
- `apps/web/src/AppProviders.tsx`
- `apps/web/src/auth/authApi.ts`
- `apps/web/src/auth/AuthContext.tsx`
- `apps/web/src/auth/sessionRedirect.test.ts`
- `apps/web/src/auth/sessionRedirect.ts`
- `apps/web/src/charts/observationTrend.test.ts`
- … +10 más bajo `apps/web/src`
- `docs/design/M3_ADOPTION_PLAN.md`
- `docs/product/EPIS2_THREE_MODES_DEV_PLAN.md`
- `docs/quality/M3_ANTI_DRIFT_GATES.md`

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

## Comandos de verificación sugeridos (humanos / Cursor)

```bash
npm run check
npm run test
npm run architecture:validate
npm run db:validate
```

## Prompt semilla para OpenClaw

Actúa como revisor read-only EPIS2. No modifiques archivos. No ejecutes push/commit/.env.
Microfase objetivo: H-AUTO-2. Revisa los archivos listados y entrega hallazgos en formato handoff.
