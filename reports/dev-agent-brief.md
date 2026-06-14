# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** `@docs/AGENT_CONTEXT_MINIMAL.md` + `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-layers-integrator.md` — declarar alcance en el primer mensaje.

**Generado:** 2026-06-15T00:30:00.000Z · **HEAD:** `23e6cd9` · **Fase:** A5 · **Ola:** 7 ✓

## Orquestador (MF-RAPID + STRENGTHEN)

- **PROG-RAPID** ✓ — iteración: `npm run dev:rapid` · cierre MF: `npm run quality:clinical`
- **PROG-FICHA-FIRST** ✓ wave1 — MF-FF-01…06 · home censo · `/comando` redirect · wave2 MF-FF-00 READY
- **PROG-STRENGTHEN** — **16/23** · MF-SH-01…06 ✓ · MF-IM-01…09 ✓ · **MF-CU-01** ✓
- **No** iniciar MF-CU-02+ salvo petición explícita del usuario.
- Ola 7 ✓ cerrada — MF-CU-01 ClinicalCdsCard · PROG-CDS-UX iniciado
- Plan: [`dev-agent-orchestration-plan.json`](./dev-agent-orchestration-plan.json) · reporte: [`epis2-orquestacion-paralela-2026-06-14.md`](./epis2-orquestacion-paralela-2026-06-14.md) §16

## Estado del tablero (fuente canónica)

- **Cerrado:** **PROG-CORE-HARDEN** ✓ · **PROG-IA-MODERNIZE** ✓ · **MF-CU-01** ✓ · **PROG-FICHA-FIRST** wave1 ✓
- **Siguiente (blocked):** **MF-CU-02** Hook patient-view · `quality:cds-hooks-gate`
- **Abierto:** commit tree (humano)

## Objetivo sugerido

- **MF activa:** `MF-CU-01` — Componente ClinicalCdsCard (info / suggestion / warning)
- **Gate cierre:** `npm run check` · Storybook o unit test
- **Allowlist:** `apps/web/src/components/cds/**`, `packages/epis2-ui/src/stories/**`, `packages/design-system/src/copy/es.ts`
- **Prohibido:** hooks CDS (CU-02), API `/cds/cards` (CU-04), migraciones

## Subagente primario

**[`layers-integrator`](./dev-agent-prompt-layers-integrator.md)** — Integrador capas L3+L4+L5 (UI CDS)

## Secuencia completa

1. `layers-integrator` — Integrador capas L3+L4+L5
2. `ollama-dev-writer` — Escritor dev bajo riesgo (Ollama)
3. `ollama-clinical` — IA clínica local (Ollama producto)
4. `golden-guardian` — Guardián Golden Journey
5. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `master` · cambios: 68 (lista truncada)

```
M apps/api/src/ai/client.ts
M apps/api/src/ai/routes.test.ts
M apps/api/src/ai/routes.ts
M apps/api/src/clinical/service.ts
M apps/web/src/modes/EpisModeGuard.tsx
M apps/web/src/modes/episModeGuards.ts
M apps/web/src/modes/episModes.test.ts
M apps/web/src/modes/episModes.ts
M apps/web/src/modes/modeTransitions.test.ts
M apps/web/src/pages/CommandCenterPage.tsx
M docs/AGENT_CONTEXT_MINIMAL.md
M docs/PRODUCT_CANON.md
M docs/product/EPIS2_TABLERO.md
M docs/product/PRODUCT_INVARIANTS.md
M docs/quality/ficha-first-ledger.json
M docs/quality/strengthen-ledger.json
M e2e/a11y-smoke.spec.ts
M e2e/calm-premium-signoff-capture.spec.ts
M e2e/clinical-textbox-evolution-draft.spec.ts
M e2e/golden-command-evolution.spec.ts
M e2e/golden-draft-approval.spec.ts
M e2e/golden-v2-admission-discharge.spec.ts
M e2e/helpers/demoPatient.ts
M e2e/m3-visual-signoff-capture.spec.ts
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
**Generado:** 2026-06-14T18:10:03.314Z

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
