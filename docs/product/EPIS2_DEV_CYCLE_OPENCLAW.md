# EPIS2 — Ciclo de desarrollo OpenClaw + Ollama + Evolab

> OpenClaw **orquesta** el ciclo; Ollama **planifica** localmente; Evolab **valida** hallazgos clínicos/QA.

## Flujo por tramo

```text
BOOTSTRAP
  stack:dev → ollama:probe → preconditions
  evolab:doctor
  openclaw:policy + openclaw:brief (H-AUTO-CYCLE)
  dev:agent:ollama (plan sesión)

POR TRAMO N
  openclaw:brief pre-tramo
  [tier 1–4] dev:agent:ollama + cursor prompt + SDK
  dev:auto:6h --tramo N
  dev:agent:ollama-auto (post, N>0)
  [N∈{2,4}] evolab:smoke + dev:evolab:sync
  [N=6] evolab:validate + dev:evolab:sync
  [N∈{2,4,6}] openclaw:handoff + post-tramo (verify + sync)
  dev:cycle:sync

CLOSE
  evolab:validate + dev:evolab:sync
  openclaw:handoff (H-AUTO-CYCLE)
  reports/epis2-dev-cycle-close-*.md
```

## Arranque

```powershell
# Ciclo completo (recomendado)
.\scripts\dev-agent\start-auto-dev-full-cycle.ps1

# Solo dry-run
.\scripts\dev-agent\start-auto-dev-full-cycle.ps1 -DryRun

# Secuencial (sin evolve en background)
.\scripts\dev-agent\start-auto-dev-full-cycle.ps1 -Sequential
```

```bash
npm run dev:auto:cycle -- --commit --continue-on-fail
npm run dev:auto:cycle -- --parallel --commit
npm run dev:cycle:sync
```

## Artefactos

| Archivo | Contenido |
|---------|-----------|
| `reports/epis2-dev-cycle-status.json` | Estado unificado tres capas |
| `reports/openclaw-latest-brief.md` | Brief OpenClaw activo |
| `reports/openclaw-latest-handoff.md` | Handoff + hallazgos Evolab |
| `reports/evolab-open-findings.json` | Hallazgos Evolab abiertos |
| `reports/epis2-dev-cycle-log.jsonl` | Log del ciclo |
| `reports/auto-dev-parallel.lock.json` | Candado single-instance `dev:auto:parallel` (pid, startedAt, cmd) |
| `reports/auto-dev-parallel-log.jsonl` | Log del lanzador paralelo |

## Candado single-instance (`dev:auto:parallel`)

Módulo compartido `scripts/dev-agent/auto-dev-session-lock.mjs` (adquisición atómica `wx`). `dev:auto:parallel` y `dev:auto:orchestrate` (modo secuencial) adquieren el lock; el hijo orquestador bajo parallel usa `EPIS2_AUTO_DEV_UNDER_PARALLEL=1` y no compite. `dev:auto:cycle` y `start-auto-dev-full-cycle.ps1` comprueban el lock **antes** del bootstrap — duplicado → exit 0. El lock incluye PIDs hijos (`orchestratorPid`, `evolvePid`). Stale (PID muerto) → re-adquisición automática. Comprobar: `Get-Content reports/auto-dev-parallel.lock.json`.

## Candados (L3 MAX POWER)

- OpenClaw: safe-run, verify-tramo, patch L0/L1; **sin** git commit/push
- Evolab: patching off, aprobación humana on
- Ollama: plan + ollama-auto; apply solo con `EPIS2_AUTO_DEV_OLLAMA_APPLY=1`

Ver `.openclaw/epis2/policies/epis2-auto-dev-locks.md` y `EPIS2_OPENCLAW_INTEGRATION.md`.

## Gates

```bash
npm run quality:openclaw-cycle-gate
npm run quality:openclaw-gate
npm run quality:pm03-orchestration-gate
```
