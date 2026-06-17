# EPIS2 — Integración IA asistida (mejores prácticas)

**Fecha:** 2026-06-04

---

## Qué cambió

Flujo unificado **más rápido** para Cursor y agentes:

```bash
npm run dev:session    # un comando → brief + prompts + subagente primario
```

**Entrada única:** `reports/dev-agent-brief.md`  
Incluye: MF ledger · git status · stack Ollama · loop de 7 prácticas · secuencia subagentes.

---

## Mejores prácticas integradas

| Práctica | Dónde vive |
|----------|------------|
| Alcance antes de codear | Brief + `.cursor/rules/90-ai-assisted-dev.mdc` |
| Contexto mínimo (2 archivos @) | Brief + prompt primario |
| Subagente por tipo de diff | `context.mjs` → `suggestPrimarySubagent` |
| Plan Ollama opcional | `dev:session --ollama` |
| Cierre con checklist | `npm run dev:agent:close` |
| Sin auto-commit | Schema `requiresHumanReview: true` |

---

## Comandos

| Comando | Uso |
|---------|-----|
| `npm run dev:session` | **Arranque diario** |
| `npm run dev:session -- --ollama` | + plan JSON |
| `npm run dev:agent:close` | Cierre + plantilla reporte |
| `npm run dev:agent:subagent -- layers-integrator` | Un rol puntual |

---

## Documentación

- `docs/product/EPIS2_AI_ASSISTED_DEV.md` — guía canon
- `.cursor/rules/90-ai-assisted-dev.mdc` — regla Cursor always-on
- `AGENTS.md` — paso 0 en flujo agente

---

## Gates

- `quality:dev-agent-orchestration-gate` — OK
- Tests context + schemas — 5/5 OK
- `npm run check` — OK (post lint fix)

---

## Próximo paso

En Cursor: `@reports/dev-agent-brief.md` + `@reports/dev-agent-prompt-layers-integrator.md` → implementar **ClinicalCommandPalette (Ctrl+K)** Fase B.
