# Auto-dev tramo 4 — H-AUTO-4

**Programa:** PROG-AUTO-DEV-6H / EPIS2-PM-03  
**Tramo:** Tests + repair loop  
**Gate:** npm run check

## Objetivo

Implementar el tramo con diff mínimo. Al cerrar:

```bash
npm run check
```

## Canon (leer antes de codear)

- @docs/product/PRODUCT_INVARIANTS.md
- @docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md
- @docs/product/EPIS2_CLINICAL_TERMINOLOGY.md

## Evidencia ledger

- ID: H-AUTO-4
- Commands: check

## Brief sesión (extracto)

# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** abrir `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-tramo-implementer.md` en Cursor y declarar alcance en el primer mensaje.

**Generado:** 2026-06-11T03:12:32.263Z · **Fase:** B · Tramo 0

## Estado del tablero (fuente canónica)

- **En curso:** **Hilo C** — Ola 3 longitudinal — Receta A5 ✓ · piloto M3 automatizado ✓ (signoff humano opcional) · `epis2-hilo-c-p1-print-prescription-2026-06-09.md`
- **Siguiente:** **P1**: Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/`
- **Siguiente:** **P1b**: **Clinical Calm Premium** — `THEME-CALM-01` + `UX-AESTHETIC P3` (tokens petróleo, islas tonales)
- **Siguiente:** **P1c**: MF-CLINICAL-SUMMARY-B + `UX-CALM-PATIENT` (mosaico + banner + métricas labs)

## Objetivo sugerido

- **P1**: Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/`
- **Ollama (≤24 h):** Completar la Ola 2 y avanzar con la Ola 3 longitudinal, enfocándose en las funcionalidades de impresión y gestión de documentos.
- **MF propuesta:** MF-183→200

## Subagente primario

**[`tramo-implementer`](./dev-agent-prompt-tramo-implementer.md)** — Implementador de tramo

## Secuencia completa

1. `tramo-implementer` — Implementador de tramo
2. `ollama-clinical` — IA clínica local (Ollama producto)
3. `golden-guardian` — Guardián Golden Journey
4. `gate-runner` — Ejecutor de gates
5. `ledger-keeper` — Ledger microfases

## Working tree

- Rama: `master` · cambios: 23

```
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

## Evolab (QA externo)

- Evolab hallazgos abiertos: **24** (sync 2026-06-11T03:12:28.380Z)
- Root: `C:\Users\gdela\OneDrive\Documentos Importantes\epis2-evolab`

## OpenClaw (revisores read-only)

- Brief: `@reports/openclaw-latest-brief.md`
- Handoff cierre: `npm run openclaw:handoff -- --agents auto`
- Docs: `docs/product/EPIS2_OPENCLAW_INTEGRATION.md`

## Stack local

- Estación: tier **performance** · 63 GB RAM · 12 GB VRAM
- Ollama clínica: ✓ up → `qwen3:8b`
- dev-plan: `qwen2.5-coder:7b` (auto) · dev-write: `deepseek-coder-v2:16b` (auto)
- Enrutado: `npm run ollama:route` · pull coders: `npm run ai:pull-coder-models`
- .env: ✓ · DATABASE_URL: ✓

```bash
npm run stack:dev          # si falta Postgres/Ollama
npm run ollama:probe       # probe nativo (tags + modelo)
npm run dev:ai             # terminal 2 — assist clínico
npm run dev:session        # regenerar este brief
npm run ollama:route        # modelos por función + tier estación
npm run dev:agent:ollama-auto   # probe → plan → documentación L0 (dry-run)
npm run dev:agent:ollama-write  # solo parches bajo riesgo (docs/reportes)
```

## Loop IA (mejores prácticas EPIS2)

- **1. Alcance** — Declarar MF, archivos permitidos y prohibidos antes de editar.
- **2. Contexto mínimo** — Leer solo canon + prompt del subagente activo; no re-leer todo el repo.
- **3. Diff mínimo** — Un problema, un PR lógico; reutilizar patrones existentes (`DashboardPanelGridSectio

## OpenClaw brief (read-only — revisar antes de implementar)

@reports/openclaw-latest-brief.md

# OpenClaw EPIS2 Brief

> **Microfase:** H-AUTO-4
> **Modo:** max-power-max-power-patch-code (L3)
> **Candados:** safe-run=true · patching=true · git-write=false
> **Generado:** 2026-06-11T03:15:05.271Z

## Restricciones activas

- Read-only reviewer/planner — sin commits, push, ni edits autónomos
- Perfil L3: safe-run allowlist activo
- PostgreSQL = SoT · borradores ≠ datos aprobados · IA no aprueba ni firma
- Sin import EPIS sin manifest · sin OpenMRS/Carbon · Home = Centro de Comando

## Git status (sanitized)

```
## master...origin/master [ahead 8]
 M docs/quality/auto-dev-6h-ledger.json
 M reports/auto-dev-6h-log.jsonl
 M reports/auto-dev-cursor-prompt-tramo-4.md
 M reports/auto-dev-cursor-queue.jsonl
 M reports/auto-dev-orchestrator-log.jsonl
 M reports/dev-agent-ollama-plan.json
 M reports/epis2-auto-dev-6h-close-2026-06-10.md
 M reports/epis2-dev-cycle-log.jsonl
 M reports/epis2-dev-cycle-status.json
 M reports/openclaw-latest-brief.md
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
- `docs/legacy/LEGA


## Reglas

- No @mui/* directo desde apps/web
- IA no aprueba clínica
- Español en UI visible
- Commit message: chore(auto-dev): H-AUTO-4 — Tests + repair loop
