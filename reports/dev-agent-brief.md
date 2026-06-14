# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** `@docs/AGENT_CONTEXT_MINIMAL.md` + `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-golden-guardian.md` — declarar alcance en el primer mensaje.

**Generado:** 2026-06-14T17:26:58.931Z · **HEAD:** `710bd1a` · **Fase:** B

## Orquestador (MF-RAPID + STRENGTHEN)

- **PROG-RAPID** ✓ — iteración: `npm run dev:rapid` · cierre MF: `npm run quality:clinical`
- **No** iniciar la MF READY siguiente salvo petición explícita del usuario.
- STRENGTHEN READY: **MF-IM-03** — RAG incremental (retrieval secuencial) · gate `quality:rag-retrieval-gate`
- Allowlist: services/local-ai/src/rag/**, scripts/quality/validate-rag-retrieval-gate.mjs, packages/test-fixtures/**

## Estado del tablero (fuente canónica)

- **En curso:** **PROG-CORE-HARDEN**: ✓ MF-SH-01…06 cerrado (—)
- **En curso:** **PROG-IA-MODERNIZE**: **MF-IM-03** RAG incremental (`quality:rag-retrieval-gate`)

## Objetivo sugerido

- **STRENGTHEN READY:** `MF-IM-03` — RAG incremental (retrieval secuencial)
- **Gate:** `quality:rag-retrieval-gate`

## Subagente primario

**[`golden-guardian`](./dev-agent-prompt-golden-guardian.md)** — Guardián Golden Journey

## Secuencia completa

1. `layers-integrator` — Integrador capas L3+L4+L5
2. `ollama-dev-writer` — Escritor dev bajo riesgo (Ollama)
3. `ollama-clinical` — IA clínica local (Ollama producto)
4. `golden-guardian` — Guardián Golden Journey
5. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `master` · cambios: 20

```
M .cursor/commands/epis2-session.md
M .cursor/hooks/session-start.mjs
M .cursor/rules/50-fast-loop.mdc
M .cursor/skills/epis2-session/SKILL.md
M apps/web/src/dev/dualChartModesEnv.ts
M apps/web/src/routes/home.ts
M apps/web/src/routes/router.test.ts
M apps/web/src/routes/router.tsx
M docs/AGENT_CONTEXT_MINIMAL.md
M e2e/helpers/demoPatient.ts
M reports/dev-agent-prompt-gate-runner.md
M scripts/architecture/command-center-home.mjs
M scripts/dev-agent/brief.mjs
M scripts/dev-agent/context.mjs
M scripts/dev/velocity-lib.mjs
M tests/golden-clinical-journey.spec.ts
?? apps/web/src/dev/dualChartModesEnv.test.ts
?? reports/dev-agent-audit-diff-latest.json
?? reports/epis2-auditoria-ingeniero-externo-2026-06-14.md
?? scripts/dev/strengthen-context.mjs
```

## Evolab (QA externo)

- Evolab hallazgos abiertos: **200** (sync 2026-06-14T15:49:41.450Z)
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
npm run dev:velocity       # banner vivo (STRENGTHEN + HEAD)
npm run dev:rapid          # iteración MF-RAPID
npm run dev:session        # regenerar este brief
npm run quality:strengthen-next
npm run ollama:route        # modelos por función + tier estación
```

## Loop IA (mejores prácticas EPIS2)

- **1. Alcance** — Declarar MF, archivos permitidos y prohibidos antes de editar.
- **2. Contexto mínimo** — Leer solo canon + prompt del subagente activo; no re-leer todo el repo.
- **3. Diff mínimo** — Un problema, un PR lógico; reutilizar patrones existentes (`DashboardPanelGridSection`, RAD shell).
- **4. Verificar tarde** — `npm run check` al cerrar, no tras cada línea (salvo typecheck puntual).
- **5. Gates del rol** — Ejecutar solo los del subagente + cierre estándar.
- **6. Reporte** — `reports/epis2-*.md` con alcance, gates, riesgos, próximo paso exacto.
- **7. Humano decide** — Sin commit/push automático; Ollama auto (`dev:agent:ollama-auto`) o apply L0 tras revisar plan.

## Prohibido

- OpenMRS / Carbon / dashboard como home
- Import masivo EPIS sin manifest
- Auto-aprobación clínica · IA escribiendo SoT
- Segundo Command/Form Registry temporal

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

**Fase:** B
**Generado:** 2026-06-14T17:26:58.932Z

## Secuencia recomendada

1. [`layers-integrator`](./dev-agent-prompt-layers-integrator.md) — Integrador capas L3+L4+L5
2. [`ollama-dev-writer`](./dev-agent-prompt-ollama-dev-writer.md) — Escritor dev bajo riesgo (Ollama)
3. [`ollama-clinical`](./dev-agent-prompt-ollama-clinical.md) — IA clínica local (Ollama producto)
4. [`golden-guardian`](./dev-agent-prompt-golden-guardian.md) — Guardián Golden Journey
5. [`gate-runner`](./dev-agent-prompt-gate-runner.md) — Ejecutor de gates

## Stack Ollama (desarrollo)

```bash
npm run stack:dev          # Postgres + Ollama smoke
npm run dev:ai             # terminal 2 — local-ai :3002
npm run dev:agent:ollama   # plan JSON estructurado (opcional)
npm run ai:evals:live      # evals clínicos assist
```

## Cierre sesión

```bash
npm run check
npm run test
npm run db:validate
npm run quality:layers-integration-gate
```
