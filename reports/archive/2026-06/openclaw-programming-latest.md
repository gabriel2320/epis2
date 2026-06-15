# EPIS2 — Programming Agent (OpenClaw apoyo)

> **Tramo 2** — `H-AUTO-2`: Ficha tradicional + autocompletar barra
> **Perfil OpenClaw:** L0 · safe-run=false · git-write=false
> **Generado:** 2026-06-11T03:15:16.829Z

## Rol

Agente de programación y orquestación dev (L3). Planifica con Ollama nativo; OpenClaw brief/handoff; Cursor implementa. **No** coder L5 autónomo.

✓ Sin lock paralelo activo.

## Agentes OpenClaw sugeridos (tramo)

- `security` — Security/PHI Reviewer
- `ux` — UX/M3 Reviewer
- `architecture` — Architecture/Legacy Reviewer
- `golden` — Golden Journey Reviewer
- `programming` — Programming / OpenClaw Support

## Comandos sugeridos (orden)

```bash
npm run openclaw:tramo -- --tramo 2 --phase brief
npm run ollama:route
npm run dev:agent:ollama
# Cursor: @reports/auto-dev-cursor-prompt-tramo-2.md @reports/openclaw-latest-brief.md
npm run dev:auto:6h -- --tramo 2
npm run dev:agent:ollama-auto -- --skip-plan
npm run openclaw:safe-run -- --cmd "npm run check"
npm run dev:cycle:sync
npm run dev:openclaw:sync
npm run openclaw:tramo -- --tramo 2 --phase handoff
npm run openclaw:verify-tramo -- --tramo 2
```

## Skill programming

`.openclaw/epis2/skills/epis2-programming-agent/SKILL.md`

## Gates

- `npm run quality:openclaw-gate`
- `npm run quality:openclaw-cycle-gate`
- `npm run check`

## Brief slice (programming paths)


```
## master...origin/master [ahead 8]
 M reports/auto-dev-6h-log.jsonl
 D reports/auto-dev-continuous.lock
 M reports/auto-dev-cursor-prompt-tramo-4.md
 M reports/auto-dev-cursor-queue.jsonl
 M reports/auto-dev-orchestrator-log.jsonl
 M reports/dev-agent-ollama-plan.json
 M reports/epis2-auto-dev-6h-close-2026-06-10.md
 M reports/epis2-dev-cycle-log.jsonl
 M reports/epis2-dev-cycle-status.json
 M reports/openclaw-latest-brief.md
```

## Flags (.env.example keys only — valores no cargados)

```json
{
  "NODE_ENV": "(see .env.example — value not loaded)",
  "API_HOST": "(see .env.example — value not loaded)",
  "API_PORT": "(see .env.example — value not loaded)",
  "DATABASE_URL": "(see .env.example — value not loaded)",
  "VITE_API_BASE_URL": "(see .env.example — value not loaded)",
  "SESSION_SECRET": "(see .env.example — value not loaded)",
  "SESSION_COOKIE_NAME": "(see .env.example — value not loaded)",
  "WEB_ORIGIN": "(see .env.example — value not loaded)",
  "AI_HOST": "(see .env.example — value not loaded)",
  "AI_PORT": "(see .env.example — value not loaded)",
  "OLLAMA_BASE_URL": "(see .env.example — value not loaded)",
