# EPIS2 — Kickoff ciclo OpenClaw + Ollama + Evolab

**Fecha:** 2026-06-11  
**Commits:** `12836fc` (OpenClaw L3) · `0de70d1` (commit Windows) · `6fafa5e` (tramo-3)  
**Modo:** L3 MAX POWER · `-NoPush` · Ollama nativo · OpenClaw orquesta

---

## Ciclo anterior (terminal 867023)

| Resultado | Detalle |
|-----------|---------|
| Exit | `dev:auto:cycle` FAILED (orquestador exit 1) |
| Causa | Colisión doble `dev:auto:parallel` + exit estricto sin honorar `--continue-on-fail` |
| Tramos OK | H-AUTO-1, H-AUTO-3, H-AUTO-5 (ledger DONE) |
| Tramos pendientes | H-AUTO-0, H-AUTO-2, H-AUTO-4, H-AUTO-6 (FAILED — reintentar) |
| Evolab | validate OK · **24 hallazgos** abiertos |
| OpenClaw | brief=yes · handoff=no |

**Fix aplicado:** `continue-on-fail` no falla `dev:auto:parallel`; candado sesión en `reports/auto-dev-parallel.lock`.

---

## Arranque recomendado

```powershell
.\scripts\dev-agent\start-auto-dev-full-cycle.ps1 -NoPush -Sequential -RetryFailed
```

Secuencial evita doble evolve; `-RetryFailed` reintenta tramos 0/2/4/6.

```bash
npm run dev:session -- --openclaw
# Cursor: @reports/dev-agent-brief.md @reports/openclaw-latest-brief.md
```

---

## Variables de seguridad

| Variable | Valor |
|----------|-------|
| `EPIS2_AUTO_DEV_OPENCLAW` | `1` |
| `EPIS2_AUTO_DEV_OLLAMA` | `1` |
| `EPIS2_AUTO_DEV_OLLAMA_APPLY` | `0` |
| `EPIS2_OPENCLAW_MAX_POWER` | `1` |
| `EPIS2_OPENCLAW_GIT_WRITE` | `false` |
| `EPIS2_EVOLAB_PATCHING_ENABLED` | `false` |

---

## Ollama nativo (probe)

| Estación | Modelo |
|----------|--------|
| clinical | qwen3:8b |
| dev-plan | qwen2.5-coder:7b |
| dev-write | deepseek-coder-v2:16b |

Plan activo: MF-183→200 · `reports/dev-agent-ollama-plan.json`

---

## OpenClaw

- Skills: `.openclaw/epis2/skills/` (8 revisores)
- Brief: `reports/openclaw-latest-brief.md`
- Índice: `reports/openclaw-auto-dev-index.json`
- Estado unificado: `reports/epis2-dev-cycle-status.json`

---

## Monitoreo

```powershell
Get-Content reports/epis2-dev-cycle-log.jsonl -Wait -Tail 15
Get-Content reports/auto-dev-orchestrator-log.jsonl -Wait -Tail 15
Get-Content reports/auto-dev-parallel-log.jsonl -Wait -Tail 10
Get-Content reports/auto-dev-cursor-queue.jsonl -Tail 5
```

Cola Cursor (sin `CURSOR_API_KEY`): `reports/auto-dev-cursor-prompt-tramo-*.md`

---

## Gates (pre/post)

```bash
npm run quality:openclaw-gate
npm run quality:openclaw-cycle-gate
npm run quality:pm03-orchestration-gate
```
