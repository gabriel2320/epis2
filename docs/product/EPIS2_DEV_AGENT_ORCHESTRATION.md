# EPIS2 — Orquestación agente de desarrollo (Semana 4)

**Versión:** 1.0 · **Fecha:** 2026-06-07

---

## Objetivo

Automatizar el **arranque** de un tramo (prompt canon + gates) sin violar invariantes ni auto-commit.

---

## Generar prompt de tramo

```bash
npm run dev:agent:tramo-k
# → reports/dev-agent-prompt-tramo-K.md
```

Comando npm: `npm run dev:agent:tramo-k`

Variables: `EPIS2_DEV_AGENT_TRAMO=K` · `EPIS2_DEV_AGENT_MF=MF-TRAMO-K-002`

---

## Cursor SDK (opcional, fuera del repo)

Requiere `@cursor/sdk` y `CURSOR_API_KEY` en el entorno local:

```typescript
import { Agent } from '@cursor/sdk';
import { readFileSync } from 'node:fs';

const prompt = readFileSync('reports/dev-agent-prompt-tramo-K.md', 'utf8');

const result = await Agent.prompt(prompt, {
  apiKey: process.env.CURSOR_API_KEY!,
  model: { id: 'composer-2.5' },
  local: { cwd: process.cwd() },
});
```

**Reglas:** no push automático · no import EPIS sin manifest · cerrar solo con gates del tramo.

---

## Evals en cierre de tramo

```bash
npm run dev:ai
npm run ai:evals:tramo-j    # blueprints del tramo activo
npm run ai:evals:closure    # EPIS2_AI_EVALS_LIVE=all (todos los assist)
```

Salida: `reports/ai-evals-live-latest.json`

---

## Signoff clínico A–J

Checklist humano: [`EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md`](./EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md)  
Gate estructura: `npm run quality:tramos-clinical-signoff-gate`

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
