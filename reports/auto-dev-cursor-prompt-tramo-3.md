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

> **Inicio rápido:** abrir `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-ollama-clinical.md` en Cursor y declarar alcance en el primer mensaje.

**Generado:** 2026-06-09T21:51:19.823Z · **Fase:** B

## Estado del tablero (fuente canónica)

- **En curso:** **Hilo C** — Ola 3 longitudinal — Receta A5 ✓ · piloto M3 automatizado ✓ (signoff humano opcional) · `epis2-hilo-c-p1-print-prescription-2026-06-09.md`
- **Siguiente:** **P1**: P1b alto contraste ampliado · o Storybook familia `Print*` (Auditoría II §5)
- **Siguiente:** P1b: Alto contraste ampliado (3.6 diferido — requiere signoff visual)
- **Siguiente:** P1c: Fase 5 auditoría — checklist pre-producción (solo si sale del laboratorio)

## Objetivo sugerido

- **P1**: P1b alto contraste ampliado · o Storybook familia `Print*` (Auditoría II §5)

## Subagente primario

**[`ollama-clinical`](./dev-agent-prompt-ollama-clinical.md)** — IA clínica local (Ollama producto)

## Secuencia completa

1. `layers-integrator` — Integrador capas L3+L4+L5
2. `ollama-dev-writer` — Escritor dev bajo riesgo (Ollama)
3. `ollama-clinical` — IA clínica local (Ollama producto)
4. `golden-guardian` — Guardián Golden Journey
5. `gate-runner` — Ejecutor de gates

## Working tree

- Rama: `master` · cambios: 18

```
M README.md
M docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md
M docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md
M docs/product/EPIS2_RELEASE_ROADMAP.md
M docs/product/EPIS2_TABLERO.md
M docs/product/EPIS2_WAVE_EXECUTION_CANON.md
M reports/dev-agent-brief.md
M reports/dev-agent-prompt-gate-runner.md
M reports/dev-agent-prompt-golden-guardian.md
M reports/dev-agent-prompt-layers-integrator.md
M reports/dev-agent-prompt-ollama-clinical.md
M reports/epis2-wave-execution-canon-v1.md
M scripts/dev-agent/brief.mjs
M scripts/dev-agent/context.mjs
?? docs/INDEX.md
?? reports/INDEX.md
?? reports/dev-agent-prompt-ollama-dev-writer.md
?? reports/epis2-f4-sesion-documental-2026-06-09.md
```

## Stack local

- Estación: tier **minimal** · 15 GB RAM · ? GB VRAM
- Ollama clínica: ✓ up → `qwen3:8b`
- dev-plan: `qwen3:8b` (auto) · dev-write: `qwen3:8b` (auto)
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

**Fas

## Reglas

- No @mui/* directo desde apps/web
- IA no aprueba clínica
- Español en UI visible
- Commit message: chore(auto-dev): H-AUTO-3 — Deprecación UI redundante
