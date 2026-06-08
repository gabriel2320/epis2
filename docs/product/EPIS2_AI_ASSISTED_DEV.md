# EPIS2 — Desarrollo asistido por IA

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Relacionado:** `EPIS2_DEV_SUBAGENTS.md` · `EPIS2_DEV_AGENT_ORCHESTRATION.md` · `AGENTS.md`

---

## Principio

**Un comando → un brief → un subagente primario → cierre con gates.**

La IA acelera lectura y planificación; el humano aprueba alcance, commit y despliegue.

---

## Flujo diario (3 minutos de arranque)

```bash
npm run stack:dev              # Postgres + Ollama smoke (si hace falta)
npm run dev:session            # brief + prompts
# Terminal 2 (si tocas assist clínico):
npm run dev:ai
```

**Cursor:** `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-<primario>.md`

Con plan Ollama:

```bash
npm run ollama:route                         # modelos por función + tier estación
npm run dev:session -- --ollama              # solo plan sesión
npm run dev:session -- --ollama-auto         # probe → plan → docs L0 (dry-run)
npm run dev:session -- --ollama-auto --apply # idem + apply Tier L0 tras revisar
npm run ollama:probe                         # diagnóstico + tabla rutas
```

---

## Mejores prácticas (integradas en el brief)

| # | Práctica | Por qué |
|---|----------|---------|
| 1 | Declarar alcance antes de codear | Evita drift vs invariantes |
| 2 | Contexto mínimo (canon + subagente) | Menos tokens, menos alucinación |
| 3 | Diff mínimo, un objetivo | Review más rápido |
| 4 | Verificar al cerrar, no en cada línea | Menos interrupciones |
| 5 | Gates del rol, no todos a la vez | CI local más corto |
| 6 | Reporte en `reports/` | Memoria entre sesiones |
| 7 | Humano commit/push | Canon EPIS2 |

---

## Subagente primario (automático)

Inferido de `git status` + fase activa:

| Señal en diff | Subagente |
|---------------|-----------|
| `apps/web`, UI packages | `layers-integrator` |
| `local-ai`, assist | `ollama-clinical` |
| `e2e/`, golden | `golden-guardian` |
| `--tramo X` | `tramo-implementer` |
| `scripts/quality` | `ci-parity` |

Override: `npm run dev:agent:subagent -- layers-integrator`

---

## Cierre

```bash
npm run dev:agent:close
```

Genera plantilla `reports/epis2-session-close-YYYY-MM-DD.md` y ejecuta checklist.

Gates extra según rol: ver brief (`layers-integration-gate`, `golden-journey`, etc.).

---

## Comandos

| Comando | Artefacto |
|---------|-----------|
| `npm run dev:session` | **`reports/dev-agent-brief.md`** (entrada única) |
| `npm run dev:agent:orchestrate` | prompts + brief (sin Ollama) |
| `npm run dev:agent:ollama` | `dev-agent-ollama-plan.json` |
| `npm run dev:agent:ollama-auto` | Probe nativo → plan → write L0 → `dev-agent-ollama-automation.json` |
| `npm run dev:agent:ollama-auto -- --apply` | Aplica Tier L0 (reportes/docs) tras revisión |
| `npm run dev:agent:ollama-write` | Plan parches L0/L1 → `dev-agent-ollama-write-plan.json` |
| `npm run dev:agent:ollama-write -- --apply` | Aplica Tier L0 (reportes/docs) tras revisión |
| `npm run ai:pull-coder-models` | Descarga modelos cuantizados especialistas en código (dev) |
| `npm run ollama:route` | Modelo por función según tier de estación |
| `npm run dev:agent:close` | checklist + plantilla reporte |
| `npm run quality:microphase-next` | MF READY del ledger |

---

## Anti-patrones

- Pegar todo el repo al chat
- Dejar que la IA haga commit/push
- Mezclar plan dev Ollama con escritura clínica SoT
- Saltarse `quality:microphase-next` en trabajo MF numerado
- Implementación masiva de catálogo IDC en un solo prompt

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
