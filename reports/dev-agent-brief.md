# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** abrir `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-tramo-implementer.md` en Cursor y declarar alcance en el primer mensaje.

**Generado:** 2026-06-11T03:19:22.871Z · **Fase:** B · Tramo 0

## Estado del tablero (fuente canónica)

- **En curso:** **Hilo C** — Ola 3 longitudinal — Receta A5 ✓ · piloto M3 automatizado ✓ (signoff humano opcional) · `epis2-hilo-c-p1-print-prescription-2026-06-09.md`
- **Siguiente:** **P1**: Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/`
- **Siguiente:** **P1b**: **Clinical Calm Premium** — `THEME-CALM-01` + `UX-AESTHETIC P3` (tokens petróleo, islas tonales)
- **Siguiente:** **P1c**: MF-CLINICAL-SUMMARY-B + `UX-CALM-PATIENT` (mosaico + banner + métricas labs)

## Objetivo sugerido

- **P1**: Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/`
- **Ollama (≤24 h):** Completar la Ola 2 y avanzar hacia la Ola 3 longitudinal.
- **MF propuesta:** MF-183→190

## Subagente primario

**[`tramo-implementer`](./dev-agent-prompt-tramo-implementer.md)** — Implementador de tramo

## Secuencia completa

1. `tramo-implementer` — Implementador de tramo
2. `ollama-clinical` — IA clínica local (Ollama producto)
3. `golden-guardian` — Guardián Golden Journey
4. `gate-runner` — Ejecutor de gates
5. `ledger-keeper` — Ledger microfases

## Working tree

- Rama: `master` · cambios: 16

```
M docs/quality/auto-dev-6h-ledger.json
M reports/auto-dev-6h-log.jsonl
M reports/auto-dev-continuous-log.jsonl
M reports/auto-dev-orchestrator-log.jsonl
M reports/auto-dev-parallel-log.jsonl
M reports/dev-agent-ollama-automation.json
M reports/dev-agent-ollama-write-plan.json
M reports/epis2-auto-dev-6h-close-2026-06-10.md
M reports/epis2-dev-cycle-close-2026-06-11.md
M reports/epis2-dev-cycle-log.jsonl
M reports/epis2-dev-cycle-status.json
M reports/epis2-session-close-2026-06-11.md
M reports/evolab-open-findings.json
M reports/openclaw-auto-dev-index.json
M reports/openclaw-latest-brief.md
M reports/openclaw-latest-handoff.md
```

## Evolab (QA externo)

- Evolab hallazgos abiertos: **24** (sync 2026-06-11T03:19:19.504Z)
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
npm run check
npm run test
npm run db:validate
npm run quality:layers-integration-gate   # si tocaste UI
npm run dev:agent:close                     # checklist + plantilla reporte
```

---

# EPIS2 — Sesión subagentes de desarrollo

**Fase:** B · **Tramo:** 0
**Generado:** 2026-06-11T03:19:22.872Z

## Secuencia recomendada

1. [`tramo-implementer`](./dev-agent-prompt-tramo-implementer.md) — Implementador de tramo
2. [`ollama-clinical`](./dev-agent-prompt-ollama-clinical.md) — IA clínica local (Ollama producto)
3. [`golden-guardian`](./dev-agent-prompt-golden-guardian.md) — Guardián Golden Journey
4. [`gate-runner`](./dev-agent-prompt-gate-runner.md) — Ejecutor de gates
5. [`ledger-keeper`](./dev-agent-prompt-ledger-keeper.md) — Ledger microfases

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
