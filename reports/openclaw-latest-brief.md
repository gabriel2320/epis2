# OpenClaw EPIS2 Brief

> **Microfase:** H-AUTO-1
> **Modo:** max-power-max-power-patch-code (L3)
> **Candados:** safe-run=true · patching=true · git-write=false
> **Generado:** 2026-06-11T03:05:02.376Z

## Restricciones activas

- Read-only reviewer/planner — sin commits, push, ni edits autónomos
- Perfil L3: safe-run allowlist activo
- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma
- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando

## Git status (sanitized)

```
## master...origin/master [ahead 2]
 M reports/auto-dev-orchestrator-log.jsonl
 M reports/auto-dev-parallel-log.jsonl
 M reports/dev-agent-ollama-plan.json
 M reports/epis2-dev-cycle-log.jsonl
 M reports/epis2-dev-cycle-status.json
 M reports/evolab-open-findings.json
 M reports/openclaw-auto-dev-index.json
 M reports/openclaw-latest-brief.md
 M scripts/dev-agent/start-auto-dev-full-cycle.ps1
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
Microfase objetivo: H-AUTO-1. Revisa los archivos listados y entrega hallazgos en formato handoff.
