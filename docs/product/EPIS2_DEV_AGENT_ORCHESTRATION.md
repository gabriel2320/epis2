# EPIS2 — Orquestación agente de desarrollo

**Versión:** 2.0 · **Fecha:** 2026-06-04

---

## Objetivo

Automatizar el **arranque** de sesiones de desarrollo: prompts canon + subagentes + plan Ollama opcional.  
Sin violar invariantes · sin auto-commit · sin mezclar IA dev con escritura clínica SoT.

Catálogo subagentes: [`EPIS2_DEV_SUBAGENTS.md`](./EPIS2_DEV_SUBAGENTS.md)

---

## Flujo recomendado

```bash
npm run stack:dev                 # Postgres + Ollama smoke
npm run dev:session               # brief único + prompts (opcional: --ollama | --ollama-auto)
# Cursor: @reports/dev-agent-brief.md @reports/dev-agent-prompt-<primario>.md
# … trabajo humano / Cursor …
npm run dev:agent:close           # checklist + plantilla reporte
```

---

## Comandos

| Comando | Salida |
|---------|--------|
| `npm run dev:agent:orchestrate` | `reports/dev-agent-session.md` + prompts por subagente |
| `npm run dev:agent:orchestrate -- --tramo J` | + `dev-agent-prompt-tramo-J.md` |
| `npm run dev:agent:subagent -- --subagent golden-guardian` | Un prompt |
| `npm run dev:agent:tramo-k` | Compat Semana 4 — tramo K |
| `npm run dev:agent:ollama` | `reports/dev-agent-ollama-plan.json` |
| `npm run dev:agent:ollama-auto` | Probe → plan → write L0 → `dev-agent-ollama-automation.json` |
| `npm run ollama:probe` | Diagnóstico tags + modelo instalado |
| `npm run dev:agent:ollama-write` | `reports/dev-agent-ollama-write-plan.json` |
| `npm run dev:agent:ollama-write -- --apply` | Aplica Tier L0 (reportes/docs) tras revisión |

Variables: `EPIS2_DEV_AGENT_PHASE` · `EPIS2_DEV_AGENT_TRAMO` · `EPIS2_DEV_AGENT_MF`

Política: [`EPIS2_DEV_AGENT_LOW_RISK_WRITE.md`](./EPIS2_DEV_AGENT_LOW_RISK_WRITE.md)

---

## Ollama en desarrollo (dos capas)

| Capa | Servicio | Uso |
|------|----------|-----|
| **Dev planning** | Ollama directo vía `dev:agent:ollama` | Plan sesión JSON; no toca producto clínico |
| **Dev auto** | `dev:agent:ollama-auto` | Probe nativo + plan + documentación L0 (dry-run; `--apply` opcional) |
| **Dev write L0** | `dev:agent:ollama-write` | Reportes/docs en allowlist; `--apply` tras revisión humana |
| **Clínica producto** | `npm run dev:ai` → `local-ai :3002` | Draft assist, evals, chip IA en comando |

Stack:

```bash
npm run ai:pull-coder-models   # qwen2.5-coder + deepseek-coder (dev-agent)
npm run ollama:route           # modelos por función según tier estación
OLLAMA_ROUTE_MODE=auto         # fixed = usa OLLAMA_DEV_MODEL siempre
npm run dev:ai        # terminal 2 — obligatorio para assist clínico
npm run ai:evals:live # evals blueprints
npm run ai:evals:closure
```

---

## Cursor SDK (opcional, fuera del repo)

Ver **[EPIS2_PM03_AUTO_ORCHESTRATION.md](./EPIS2_PM03_AUTO_ORCHESTRATION.md)** — orquestador 6 h con Ollama + cola Cursor.

Requiere `@cursor/sdk` y `CURSOR_API_KEY`:

```typescript
import { Agent } from '@cursor/sdk';
import { readFileSync } from 'node:fs';

const prompt = readFileSync('reports/dev-agent-prompt-layers-integrator.md', 'utf8');

const result = await Agent.prompt(prompt, {
  apiKey: process.env.CURSOR_API_KEY!,
  model: { id: 'composer-2.5' },
  local: { cwd: process.cwd() },
});
```

**Reglas:** no push automático · no import EPIS sin manifest · cerrar solo con gates.

---

## Evals en cierre de tramo

```bash
npm run dev:ai
npm run ai:evals:tramo-j
npm run ai:evals:closure
```

Salida: `reports/ai-evals-live-latest.json`

---

## Signoff clínico A–K

Checklist: [`EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md`](./EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md)  
Gate: `npm run quality:tramos-clinical-signoff-gate`

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
