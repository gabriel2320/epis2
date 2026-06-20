# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** `@docs/AGENT_CONTEXT_MINIMAL.md` + `@docs/archive/AGENT_SCOPE_EXCLUSIONS.md` + `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-golden-guardian.md` — declarar alcance en el primer mensaje.

**Generado:** 2026-06-20T00:00:44.598Z · **HEAD:** `9d86fae` · **Fase:** cica

## Orquestador (PROG-PURGE-CICA + CICA)

- **Alcance agente:** `docs/archive/AGENT_SCOPE_EXCLUSIONS.md` — no retomar tramos/olas archivados
- **Iteración:** `npm run dev:rapid` · cierre MF: `npm run quality:clinical`
- **Visual activa:** CICA `/app/*` · legacy `/espacio/*` = fallback only
- **No** iniciar MF READY de programas cerrados salvo petición explícita + `EPIS2_ALLOW_ARCHIVED_SCOPE=1`
- Programas cerrados: `docs/archive/ARCHIVED_PROGRAMS_INDEX.md`


## Estado brújula + tablero

_Brújula (`EPIS2_CURRENT_STATE`) manda; tablero = índice humano._

- Brújula: PROG-PURGE-CICA
- Tablero propuesto: PROG-PURGE-CICA (archivo + perímetro agente)

**Pasos derivados:**
- PROG-PURGE-CICA (archivo + perímetro agente): 4 — MF-PURGE-04…07 Índices + agent scope + alinear tablero
- Merge feat/prog-aesthetic-reset-close → master (CICA)
- PROG-PURGE-CICA: archivar · referenciar · perímetro agente

## Objetivo sugerido

- PROG-PURGE-CICA (archivo + perímetro agente): 4 — MF-PURGE-04…07 Índices + agent scope + alinear tablero

## Subagente primario

**[`golden-guardian`](./dev-agent-prompt-golden-guardian.md)** — Guardián Golden Journey

## Secuencia completa

1. `golden-guardian` — Guardián Golden Journey
2. `ollama-dev-writer` — Escritor dev bajo riesgo (Ollama)
3. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `chore/mf-knip-05-c-dead-code-purge` · cambios: 39 (lista truncada)

```
M .cursor/rules/00-product-canon.mdc
M .cursor/rules/05-agent-archive-boundary.mdc
M .cursor/rules/50-material-ui.mdc
M .cursor/rules/80-tramo-scaffold.mdc
M apps/web/src/cica/CicaExperimentalBanner.tsx
M apps/web/src/components/actions/EpisBulkActionMenu.tsx
D apps/web/src/components/classic-md3/EpisClassicMd3SplitPane.tsx
M apps/web/src/components/classic-md3/index.ts
M apps/web/src/components/dashboard-md3/EpisDashboardMd3MainGrid.tsx
M apps/web/src/components/grids/radBulkActions.ts
M apps/web/src/quality/uiDensityRules.ts
M apps/web/src/routes/cicaLegacyRedirects.ts
M docs/AGENT_CONTEXT_MINIMAL.md
M docs/EPIS2_CURRENT_STATE.md
M docs/MODULE_INVENTORY.md
M docs/PRODUCT_CANON.md
M docs/adr/ADR-002-dual-chart-modes.md
M docs/architecture/EPIS2_MODES_LAYER.md
M docs/architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md
M docs/archive/AGENT_SCOPE_EXCLUSIONS.md
M docs/archive/TRUNCATED_MODULES.md
M docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md
M docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md
M docs/design/EPIS2_CICA_SCREEN_MAP_v1.md
```

## OpenClaw (revisores read-only)

- Brief: `@reports/archive/2026-06/openclaw-latest-brief.md`
- Handoff cierre: `npm run openclaw:handoff -- --agents auto`
- Docs: `docs/product/EPIS2_OPENCLAW_INTEGRATION.md`

## Stack local

- Estación: tier **performance** · 63 GB RAM · 12 GB VRAM
- Ollama clínica: ✓ up → `qwen3:8b`
- dev-plan: `qwen2.5-coder:7b` (auto) · dev-write: `deepseek-coder-v2:16b` (auto)
- Enrutado: `npm run ollama:route` · pull coders: `npm run ai:pull-coder-models`
- .env: ✗ · DATABASE_URL: ✗

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
**Generado:** 2026-06-20T00:00:44.599Z

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
