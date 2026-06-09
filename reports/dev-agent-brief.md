# EPIS2 — Dev Brief (IA asistida)

> **Inicio rápido:** abrir `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-tramo-implementer.md` en Cursor y declarar alcance en el primer mensaje.

**Generado:** 2026-06-09T11:34:28.469Z · **Fase:** B · Tramo J

## Objetivo sugerido

- **Ollama:** Implementar grids dashboard + acordeones en formularios
- **MF propuesta:** MF-RAD-M3-A

## Subagente primario

**[`tramo-implementer`](./dev-agent-prompt-tramo-implementer.md)** — Implementador de tramo

## Secuencia completa

1. `tramo-implementer` — Implementador de tramo
2. `ollama-clinical` — IA clínica local (Ollama producto)
3. `golden-guardian` — Guardián Golden Journey
4. `gate-runner` — Ejecutor de gates
5. `ledger-keeper` — Ledger microfases

## Working tree

- Rama: `master` · cambios: 0

_Working tree limpio._

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

**Fase:** B · **Tramo:** J
**Generado:** 2026-06-09T11:34:28.469Z

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
