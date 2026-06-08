# EPIS2 — Subagentes de desarrollo

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Orquestación:** `docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md`  
**Origen:** `reports/epis2-master-architect-program-v2.md` §5 + Semana 4 dev automation

---

## Principio

Los subagentes **no** implementan catálogo masivo ni importan legacy sin manifiesto.  
Cada uno tiene alcance, canon y gates propios. Ollama **planifica**; el humano **aprueba y ejecuta**.

---

## Catálogo

| ID | Rol | Cuándo usar |
|----|-----|-------------|
| `tramo-implementer` | Scaffold MF tramo clínico | Tramo J/K, panel IDC |
| `layers-integrator` | L3 UX + L4 RAD + L5 productivity | Dashboard, grids, shell |
| `golden-guardian` | Golden Journey G0–G3 | Cambios flujo clínico |
| `m3-guardian` | Densidad M3 / anti-deriva UI | Diff en `apps/web` |
| `ollama-clinical` | Assist producto + evals | Blueprints, `local-ai` |
| `gate-runner` | Cierre sesión estándar | Siempre al terminar |
| `ledger-keeper` | Microfases MF | Apertura/cierre MF |
| `ci-parity` | CI local Postgres | Pre-PR |

---

## Generar prompts

```bash
npm run dev:session              # recomendado — brief + prompts + subagente primario
npm run dev:agent:orchestrate    # solo prompts + brief
npm run dev:agent:tramo-k        # tramo K (compat)
npm run dev:agent:subagent -- layers-integrator
```

Salida principal: **`reports/dev-agent-brief.md`** (adjuntar en Cursor).

---

## Ollama como asistente de planificación

```bash
npm run stack:dev      # Postgres + Ollama smoke
npm run dev:agent:ollama
# → reports/dev-agent-ollama-plan.json (JSON validado, requiresHumanReview: true)
```

Ollama propone: objetivo, paths permitidos, secuencia subagentes, gates.  
**No** escribe código ni corre gates automáticamente.

IA clínica producto (borradores assist) sigue en `dev:ai` + `ai:evals:live` — subagente `ollama-clinical`.

---

## Secuencias por fase

| Fase | Subagentes |
|------|------------|
| A (visual) | layers-integrator → m3-guardian → gate-runner |
| B (productividad) | layers-integrator → ollama-clinical → golden-guardian → gate-runner |
| Tramo clínico | tramo-implementer → ollama-clinical → golden-guardian → gate-runner → ledger-keeper |
| Default | gate-runner → ci-parity → ledger-keeper |

---

## Prohibido

- Subagentes paralelos tocando el mismo registry
- Auto-commit / auto-push
- Ollama escribiendo SoT o aprobando borradores en flujo dev
- Implementación masiva IDC sin MF en ledger

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
