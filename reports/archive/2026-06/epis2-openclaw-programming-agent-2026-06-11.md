# EPIS2 — Agente de programación OpenClaw (kickoff)

**Fecha:** 2026-06-11  
**Agent ID:** `programming`  
**Skill:** `.openclaw/epis2/skills/epis2-programming-agent/SKILL.md`

---

## Qué es

Agente L3 de **programación y apoyo OpenClaw**: enruta Ollama nativo, PM-03, safe-run y cola Cursor. **No** es coder autónomo L5.

---

## Comandos

```bash
# Slice por tramo (recomendado al iniciar trabajo)
npm run openclaw:programming -- --tramo 2

# Por microfase / ID ledger
npm run openclaw:programming -- --mf H-AUTO-2

# Salida JSON para automatización
npm run openclaw:programming -- --tramo 1 --json

# Brief con agente programming incluido
npm run openclaw:brief -- --mf H-AUTO-2 --agents programming,security,ux

# Sesión dev con OpenClaw
npm run dev:session -- --openclaw
# Cursor: @reports/openclaw-programming-latest.md @reports/openclaw-latest-brief.md
```

---

## Artefactos

| Archivo | Contenido |
|---------|-----------|
| `reports/openclaw-programming-latest.md` | Slice activo (comandos + gates) |
| `.agent-runs/openclaw/programming-support-*.md` | Histórico por ejecución |
| `reports/openclaw-latest-brief.md` | Brief OpenClaw global |
| `reports/auto-dev-cursor-prompt-tramo-N.md` | Prompt Cursor Tier X |

---

## Tramos con `programming` auto-sugerido

H-AUTO-0, 1, 2, 3, 4 (vía `AUTO_DEV_TRAMO_AGENTS` + `suggestAgents`).

---

## Ejemplo de flujo tramo 2

```bash
npm run openclaw:programming -- --tramo 2
npm run openclaw:tramo -- --tramo 2 --phase brief
npm run ollama:route && npm run dev:agent:ollama
# Cursor: @reports/auto-dev-cursor-prompt-tramo-2.md
npm run dev:auto:6h -- --tramo 2
npm run openclaw:tramo -- --tramo 2 --phase handoff
```

---

## Candados

- `EPIS2_OPENCLAW_GIT_WRITE=false` — sin commit/push desde OpenClaw
- `EPIS2_AUTO_DEV_OLLAMA_APPLY=0` — apply Ollama solo humano
- Lock paralelo: `reports/auto-dev-parallel.lock.json` (si existe, no duplicar ciclo)
