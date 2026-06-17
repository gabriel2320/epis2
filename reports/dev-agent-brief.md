# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** `@docs/AGENT_CONTEXT_MINIMAL.md` + `@docs/archive/AGENT_SCOPE_EXCLUSIONS.md` + `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-ollama-clinical.md` — declarar alcance en el primer mensaje.

**Generado:** 2026-06-17T00:41:41.198Z · **HEAD:** `1fc8d80` · **Fase:** cica

## Orquestador (PROG-PURGE-CICA + CICA)

- **Alcance agente:** `docs/archive/AGENT_SCOPE_EXCLUSIONS.md` — no retomar tramos/olas archivados
- **Iteración:** `npm run dev:rapid` · cierre MF: `npm run quality:clinical`
- **Visual activa:** CICA `/app/*` · legacy `/espacio/*` = fallback only
- **No** iniciar MF READY de programas cerrados salvo petición explícita + `EPIS2_ALLOW_ARCHIVED_SCOPE=1`
- Programas cerrados: `docs/archive/ARCHIVED_PROGRAMS_INDEX.md`


## Estado brújula + tablero

_Brújula (`EPIS2_CURRENT_STATE`) manda; tablero = índice humano._

- Brújula: **PROG-PURGE-CICA** + merge **CICA/aesthetic** — `product/EPIS2_PURGE_ARCHIVE_PLAN.md` · UX-LAB ✓ cerrado · visual activa: `/app/*` CICA.
- Tablero propuesto: PROG-PURGE-CICA (archivo + perímetro agente)

**Pasos derivados:**
- PROG-PURGE-CICA (archivo + perímetro agente): 4 — MF-PURGE-04…07 Índices + agent scope + alinear tablero
- Merge feat/prog-aesthetic-reset-close → master (CICA)
- PROG-PURGE-CICA: archivar · referenciar · perímetro agente

## Objetivo sugerido

- PROG-PURGE-CICA (archivo + perímetro agente): 4 — MF-PURGE-04…07 Índices + agent scope + alinear tablero

## Subagente primario

**[`ollama-clinical`](./dev-agent-prompt-ollama-clinical.md)** — IA clínica local (Ollama producto)

## Secuencia completa

1. `golden-guardian` — Guardián Golden Journey
2. `ollama-dev-writer` — Escritor dev bajo riesgo (Ollama)
3. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `feat/prog-aesthetic-reset-close` · cambios: 516 (lista truncada)

```
M docs/product/EPIS2_TABLERO.md
M reports/dev-agent-brief.md
M reports/dev-agent-prompt-gate-runner.md
M reports/dev-agent-prompt-golden-guardian.md
M reports/dev-agent-prompt-layers-integrator.md
M reports/dev-agent-prompt-ollama-dev-writer.md
M reports/dev-agent-prompt-paper-mode.md
D reports/dual-chart-session-brief.md
D reports/epis2-ai-ext-inference.md
D reports/epis2-architecture-inventory-001-100-review.md
D reports/epis2-architecture-inventory-101-200-review.md
D reports/epis2-audit-tramo-e-004-preanesthesia.md
D reports/epis2-chips-forms-completion.md
D reports/epis2-ciclo-a-doc-sync.md
D reports/epis2-classic-md3-ai-design-agents-2026-06-08.md
D reports/epis2-consolidation-2-ci-close-plan-2026-06-15.md
D reports/epis2-dashboard-md3-ai-design-agents-2026-06-08.md
D reports/epis2-dashboard-md3-inventory-2026-06-08.md
D reports/epis2-global-screen-form-audit.md
D reports/epis2-idc-execution-matrix.md
D reports/epis2-layout-01-two-pane-design.md
D reports/epis2-layout-02-context-pane.md
D reports/epis2-layout-03-ia-assist.md
D reports/epis2-layout-04-drag-drop.md
```

## Evolab (QA externo)

- Evolab hallazgos abiertos: **200** (sync 2026-06-14T15:49:41.450Z)
- Root: `C:\Users\gdela\OneDrive\Documentos Importantes\epis2-evolab`

## OpenClaw (revisores read-only)

- Brief: `@reports/archive/2026-06/openclaw-latest-brief.md`
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
npm run dev:velocity       # banner vivo
npm run dev:rapid          # iteración MF-RAPID
npm run dev:session        # regenerar este brief
```

## Fuera de alcance (archivado)

- `reports/archive/**` · tramos A–K · three modes · olas M3 · subagentes `tramo-implementer`, `layers-integrator`, `m3-guardian`
- Índice programas cerrados: `docs/archive/ARCHIVED_PROGRAMS_INDEX.md`

## Loop IA (mejores prácticas EPIS2)

- **1. Alcance** — Declarar MF, archivos permitidos y prohibidos antes de editar.
- **2. Contexto mínimo** — Leer solo canon + prompt del subagente activo; no re-leer todo el repo.
- **3. Diff mínimo** — Un problema, un PR lógico; reutilizar patrones CICA (`CicaAppShell`, `CicaPatientScreenFrame`).
- **4. Verificar tarde** — `npm run check` al cerrar, no tras cada línea (salvo typecheck puntual).
- **5. Gates del rol** — Ejecutar solo los del subagente + cierre estándar.
- **6. Reporte** — `reports/epis2-*.md` con alcance, gates, riesgos, próximo paso exacto.
- **7. Humano decide** — Sin commit/push automático; Ollama auto (`dev:agent:ollama-auto`) o apply L0 tras revisar plan.

## Prohibido

- OpenMRS / Carbon / dashboard como home
- Import masivo EPIS sin manifest
- Auto-aprobación clínica · IA escribiendo SoT
- Segundo Command/Form Registry temporal
- Planificar desde `reports/archive/` o reabrir tramos/olas sin MF + EPIS2_ALLOW_ARCHIVED_SCOPE=1

## Cierre sesión

```bash
npm run dev:rapid
npm run quality:clinical   # cierre MF clínico
npm run quality:full       # pre-PR
npm run db:validate
npm run dev:agent:close    # checklist + plantilla reporte
```

---

# EPIS2 — Sesión subagentes de desarrollo

**Fase:** cica
**Generado:** 2026-06-17T00:41:41.199Z

## Secuencia recomendada

1. [`golden-guardian`](./dev-agent-prompt-golden-guardian.md) — Guardián Golden Journey
2. [`ollama-dev-writer`](./dev-agent-prompt-ollama-dev-writer.md) — Escritor dev bajo riesgo (Ollama)
3. [`gate-runner`](./dev-agent-prompt-gate-runner.md) — Ejecutor de gates

## Stack Ollama (desarrollo)

```bash
npm run stack:dev          # Postgres + Ollama smoke
npm run dev:ai             # terminal 2 — local-ai :3002
npm run dev:agent:ollama   # plan JSON estructurado (opcional)
npm run ai:evals:live      # evals clínicos assist
```

## Cierre sesión

```bash
npm run dev:rapid
npm run quality:clinical   # cierre MF clínico
npm run quality:full       # pre-PR
```
