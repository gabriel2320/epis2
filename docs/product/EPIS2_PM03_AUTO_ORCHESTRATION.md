# EPIS2-PM-03 — Orquestación autodesarrollo 6 h (Ollama + Cursor + gates)

**Versión:** 1.0 · **Fecha:** 2026-06-10  
**Programa padre:** [EPIS2_AUTO_DEV_6H_PROGRAM.md](./EPIS2_AUTO_DEV_6H_PROGRAM.md)

> **Objetivo:** condiciones reproducibles para ~6 h de desarrollo asistido **sin humano en el loop**, combinando runner EPIS2, Ollama local y (opcional) Cursor SDK.

---

## Arquitectura

```text
start-auto-dev-6h.ps1 / dev:auto:orchestrate
        │
        ▼
  preconditions (env + Ollama + git)
        │
        ▼
  ┌─ por cada tramo H-AUTO-N (hasta 6 h) ─────────────────┐
  │  1. generate-auto-dev-cursor-prompt (Tier X)           │
  │  2. cursor-sdk-tramo (si CURSOR_API_KEY)               │
  │     └─ si no → cola reports/auto-dev-cursor-queue.jsonl│
  │  3. dev:auto:6h --tramo N --commit [--ollama-auto]     │
  │  4. dev:agent:ollama-auto [--apply] (si OLLAMA=1)      │
  │  5. pausa EPIS2_AUTO_DEV_TRAMO_PAUSE_MS                │
  └────────────────────────────────────────────────────────┘
        │
        ▼
  push origin (si AUTHORIZED) + informe cierre
```

---

## Variables de entorno (condiciones)

| Variable | Obligatoria | Default | Uso |
|----------|-------------|---------|-----|
| `EPIS2_AUTO_DEV_AUTHORIZED` | **Sí** (commit/push) | — | `1` autoriza git automatizado |
| `EPIS2_AUTO_DEV_DURATION_HOURS` | No | `6` | Tope de wall-clock |
| `EPIS2_AUTO_DEV_TRAMO_PAUSE_MS` | No | `120000` | Pausa entre tramos (ms) |
| `EPIS2_AUTO_DEV_OLLAMA` | No | `1` | Ollama auto tras cada tramo |
| `EPIS2_AUTO_DEV_OLLAMA_APPLY` | No | `0` | `1` → `--apply` en ollama-auto |
| `EPIS2_AUTO_DEV_CURSOR_SDK` | No | `1` | Intenta Cursor SDK en tramos Tier X |
| `CURSOR_API_KEY` | No | — | Habilita `Agent.prompt` real |
| `OLLAMA_BASE_URL` | No | `http://127.0.0.1:11434` | Probe Ollama |
| `EPIS2_AUTO_DEV_RESUME` | No | `1` | Saltar tramos `DONE` en ledger |

Copiar bloque en `.env` desde `.env.example` (sección PM-03).

---

## Tramos y capas

| Tramo | Tier Ollama | Tier Cursor | Notas |
|-------|-------------|-------------|-------|
| H-AUTO-0 | plan + write L0 | — | stack:dev, brief |
| H-AUTO-1 | write L0 | L1 manual/SDK | diccionario / registry |
| H-AUTO-2 | write L0 | **SDK** | dual-chart gates |
| H-AUTO-3 | write L0 | **SDK** | legacy UI dedup |
| H-AUTO-4 | — | **SDK** | check + repair |
| H-AUTO-5 | write L0 | — | docs + ramas |
| H-AUTO-6 | plan | — | cierre + ledger |

**Tier X (código producto):** Ollama **no** escribe; Cursor SDK o agente IDE ejecuta `reports/auto-dev-cursor-prompt-tramo-N.md`.

---

## Comandos

```powershell
# Arranque Windows (recomendado)
.\scripts\dev-agent\start-auto-dev-6h.ps1

# Manual
$env:EPIS2_AUTO_DEV_AUTHORIZED="1"
$env:EPIS2_AUTO_DEV_OLLAMA="1"
$env:EPIS2_AUTO_DEV_CURSOR_SDK="1"
# $env:CURSOR_API_KEY="..."   # opcional
npm run dev:auto:preconditions
npm run dev:auto:orchestrate -- --commit --push

# Solo verificar condiciones
npm run dev:auto:preconditions

# Dry-run (sin git ni npm destructivo)
npm run dev:auto:orchestrate -- --dry-run
```

---

## Cola Cursor (sin API key)

Si no hay `CURSOR_API_KEY`, cada tramo Tier X append a:

- `reports/auto-dev-cursor-queue.jsonl`
- `reports/auto-dev-cursor-prompt-tramo-N.md`

Abrir en Cursor: `@reports/auto-dev-cursor-prompt-tramo-N.md` + `@reports/dev-agent-brief.md`

---

## Límites (invariantes)

- IA no aprueba ni firma clínica (#11–13)
- Ollama `--apply` solo Tier L0 (`reports/**`, `docs/product/**`, `docs/design/**`)
- `architecture:validate` detiene el orquestador si falla tramo 4
- No import EPIS sin manifiesto

---

## Gate

```bash
npm run quality:pm03-orchestration-gate
```

---

## Referencias

- `EPIS2_DEV_AGENT_LOW_RISK_WRITE.md`
- `EPIS2_DEV_AGENT_ORCHESTRATION.md`
- Cursor SDK: https://cursor.com/docs/sdk/typescript
