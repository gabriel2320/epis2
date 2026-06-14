# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** `@docs/AGENT_CONTEXT_MINIMAL.md` + `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-layers-integrator.md` — declarar alcance en el primer mensaje.

**Generado:** 2026-06-15T22:00:00.000Z · **Ola:** 12 ✓ · **STRENGTHEN** 21/23

## Orquestador (MF-RAPID + STRENGTHEN)

- **PROG-STRENGTHEN** — **21/23** · **MF-IC-01…02 ✓** · **PROG-INTEROP-CHILE** fases 1–2
- Ola 12 ✓ cerrada — MF-IC-02 SNRE staging · `test packages/fhir-export`
- Plan: [`dev-agent-orchestration-plan.json`](./dev-agent-orchestration-plan.json) · §22–§23 [`epis2-orquestacion-paralela-2026-06-14.md`](./epis2-orquestacion-paralela-2026-06-14.md)

## Estado del tablero (fuente canónica)

- **Cerrado:** **MF-IC-01…02** ✓ · **MF-CU-01…04** ✓ · **PROG-CDS-UX** ✓ · **PROG-IA-MODERNIZE** ✓
- **Siguiente (blocked):** **MF-IC-03** Questionnaire export piloto

## Objetivo sugerido

- **MF sugerida (blocked):** `MF-IC-03` — Questionnaire export piloto
- **Gate:** tests `packages/fhir-export`

## Subagente primario

**[`ollama-clinical`](./dev-agent-prompt-ollama-clinical.md)** — IA clínica local (Ollama producto · PROG-INTEROP-CHILE)

## Secuencia completa

1. `ollama-clinical` — IA clínica local (PROG-INTEROP-CHILE)
2. `ollama-dev-writer` — Escritor dev bajo riesgo (Ollama)
3. `ollama-clinical` — IA clínica local (Ollama producto)
4. `golden-guardian` — Guardián Golden Journey
5. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `master` · **limpio** · ahead of `origin/master`: **~22 commits**
- Último commit: `bb9a9e3`
- Push: pendiente (humano)

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

1. [`ollama-clinical`](./dev-agent-prompt-ollama-clinical.md) — IA clínica local (PROG-INTEROP-CHILE)
2. [`ollama-dev-writer`](./dev-agent-prompt-ollama-dev-writer.md) — Escritor dev bajo riesgo (Ollama)
3. [`layers-integrator`](./dev-agent-prompt-layers-integrator.md) — Integrador capas L3+L4+L5
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
