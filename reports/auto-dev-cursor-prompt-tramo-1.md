# Auto-dev tramo 1 — H-AUTO-1

**Programa:** PROG-AUTO-DEV-6H / EPIS2-PM-03  
**Tramo:** Terminología + diccionario comandos  
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

- ID: H-AUTO-1
- Commands: test -w @epis2/command-registry

## Brief sesión (extracto)

# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** abrir `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-ollama-clinical.md` en Cursor y declarar alcance en el primer mensaje.

**Generado:** 2026-06-11T02:47:39.353Z · **Fase:** B

## Estado del tablero (fuente canónica)

- **En curso:** **Hilo C** — Ola 3 longitudinal — Receta A5 ✓ · piloto M3 automatizado ✓ (signoff humano opcional) · `epis2-hilo-c-p1-print-prescription-2026-06-09.md`
- **Siguiente:** **P1**: Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/`
- **Siguiente:** **P1b**: **Clinical Calm Premium** — `THEME-CALM-01` + `UX-AESTHETIC P3` (tokens petróleo, islas tonales)
- **Siguiente:** **P1c**: MF-CLINICAL-SUMMARY-B + `UX-CALM-PATIENT` (mosaico + banner + métricas labs)

## Objetivo sugerido

- **P1**: Revisión humana opcional post-captura M3 (hover/foco/rail/two-pane claro/oscuro) — evidencia en `reports/m3-visual-evidence/2026-06-10/`

## Subagente primario

**[`ollama-clinical`](./dev-agent-prompt-ollama-clinical.md)** — IA clínica local (Ollama producto)

## Secuencia completa

1. `layers-integrator` — Integrador capas L3+L4+L5
2. `ollama-dev-writer` — Escritor dev bajo riesgo (Ollama)
3. `ollama-clinical` — IA clínica local (Ollama producto)
4. `golden-guardian` — Guardián Golden Journey
5. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `master` · cambios: 33 (lista truncada)

```
M  .env.example
A  docs/product/EPIS2_EVOLAB_INTEGRATION.md
M  docs/product/EPIS2_PM03_AUTO_ORCHESTRATION.md
M  docs/quality/auto-dev-6h-ledger.json
M  package.json
AM reports/auto-dev-6h-log.jsonl
A  reports/auto-dev-cursor-prompt-tramo-1.md
A  reports/auto-dev-cursor-prompt-tramo-2.md
A  reports/auto-dev-cursor-prompt-tramo-3.md
A  reports/auto-dev-cursor-prompt-tramo-4.md
A  reports/auto-dev-cursor-queue.jsonl
A  reports/auto-dev-orchestrator-log.jsonl
A  reports/auto-dev-parallel-log.jsonl
AM reports/dev-agent-ollama-automation.json
AM reports/dev-agent-ollama-write-plan.json
M reports/dev-agent-prompt-gate-runner.md
M reports/dev-agent-prompt-golden-guardian.md
M reports/dev-agent-prompt-layers-integrator.md
M reports/dev-agent-prompt-ollama-clinical.md
M reports/dev-agent-prompt-ollama-dev-writer.md
AM reports/epis2-auto-dev-6h-close-2026-06-10.md
A  reports/epis2-branch-archive-2026-06-10.md
A  reports/epis2-integrated-dev-kickoff-2026-06-10.md
M  scripts/dev-agent/auto-dev-orchestrator.mjs
```

## Evolab (QA externo)

- Evolab configurado — ejecutar `npm run dev:evolab:sync` para conteo de hallazgos abiertos
- Root: `C:\Users\gdela\OneDrive\Documentos Importantes\epis2-evolab`

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
- **6. Reporte** — `reports/epis2-*.md` c

## Reglas

- No @mui/* directo desde apps/web
- IA no aprueba clínica
- Español en UI visible
- Commit message: chore(auto-dev): H-AUTO-1 — Terminología + diccionario comandos
