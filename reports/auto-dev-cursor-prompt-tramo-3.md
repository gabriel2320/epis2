# Auto-dev tramo 3 — H-AUTO-3

**Programa:** PROG-AUTO-DEV-6H / EPIS2-PM-03  
**Tramo:** Deprecación UI redundante  
**Gate:** quality:dual-chart-legacy-freeze-gate

## Objetivo

Implementar el tramo con diff mínimo. Al cerrar:

```bash
npm run quality:dual-chart-legacy-freeze-gate
```

## Canon (leer antes de codear)

- @docs/product/PRODUCT_INVARIANTS.md
- @docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md
- @docs/product/EPIS2_CLINICAL_TERMINOLOGY.md

## Evidencia ledger

- ID: H-AUTO-3
- Commands: quality:dual-chart-legacy-freeze-gate, quality:three-modes-gate

## Brief sesión (extracto)

# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** abrir `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-layers-integrator.md` en Cursor y declarar alcance en el primer mensaje.

**Generado:** 2026-06-11T02:52:40.168Z · **Fase:** B

## Estado del tablero (fuente canónica)

- **En curso:** **Hilo C** — Ola 3 longitudinal — Receta A5 ✓ · piloto M3 automatizado ✓ (signoff humano opcional) · `epis2-hilo-c-p1-print-prescription-2026-06-09.md`
- **Siguiente:** **P1**: Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/`
- **Siguiente:** **P1b**: **Clinical Calm Premium** — `THEME-CALM-01` + `UX-AESTHETIC P3` (tokens petróleo, islas tonales)
- **Siguiente:** **P1c**: MF-CLINICAL-SUMMARY-B + `UX-CALM-PATIENT` (mosaico + banner + métricas labs)

## Objetivo sugerido

- **P1**: Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/`

## Subagente primario

**[`layers-integrator`](./dev-agent-prompt-layers-integrator.md)** — Integrador capas L3+L4+L5

## Secuencia completa

1. `layers-integrator` — Integrador capas L3+L4+L5
2. `ollama-dev-writer` — Escritor dev bajo riesgo (Ollama)
3. `ollama-clinical` — IA clínica local (Ollama producto)
4. `golden-guardian` — Guardián Golden Journey
5. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `master` · cambios: 39 (lista truncada)

```
M  .env.example
M  .gitignore
A  .openclaw/epis2/README.md
A  .openclaw/epis2/policies/epis2-forbidden-actions.md
A  .openclaw/epis2/policies/epis2-readonly-policy.md
A  .openclaw/epis2/skills/epis2-architecture-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-clinical-safety-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-eval-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-golden-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-ledger-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-release-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-security-phi-reviewer/SKILL.md
A  .openclaw/epis2/skills/epis2-ux-reviewer/SKILL.md
M docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md
A  docs/product/EPIS2_OPENCLAW_INTEGRATION.md
M docs/product/EPIS2_PM03_AUTO_ORCHESTRATION.md
M  docs/quality/auto-dev-6h-ledger.json
M  package.json
MM reports/auto-dev-6h-log.jsonl
M  reports/auto-dev-cursor-prompt-tramo-1.md
M  reports/auto-dev-cursor-prompt-tramo-3.md
M  reports/auto-dev-cursor-queue.jsonl
M  reports/auto-dev-orchestrator-log.jsonl
M  reports/auto-dev-parallel-log.jsonl
```

## Evolab (QA externo)

- Evolab hallazgos abiertos: **15** (sync 2026-06-11T02:52:05.630Z)
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
- **3. Diff mínimo** — Un problema, un PR lógico; reutilizar patrones existentes (`DashboardPanelGridSe

## Reglas

- No @mui/* directo desde apps/web
- IA no aprueba clínica
- Español en UI visible
- Commit message: chore(auto-dev): H-AUTO-3 — Deprecación UI redundante
