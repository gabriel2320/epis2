# EPIS2 — Proceso continuo activo (OpenClaw + Ollama + Evolab)

**Actualizado:** 2026-06-11  
**Commit base:** `fix(dev): lock single-instance auto-dev parallel` (pendiente push)

---

## Candado anti-duplicación

| Artefacto | Rol |
|-----------|-----|
| `scripts/dev-agent/auto-dev-session-lock.mjs` | Módulo compartido (wx atómico, stale-safe) |
| `reports/auto-dev-parallel.lock.json` | Lock en runtime (gitignored) |

**Comportamiento:** segunda instancia de `dev:auto:cycle`, `dev:auto:parallel` u `dev:auto:orchestrate` → aviso + **exit 0** (no error). Lock registra `orchestratorPid` y `evolvePid` cuando existen.

**Comprobar si hay ciclo activo:**

```powershell
Get-Content reports/auto-dev-parallel.lock.json -ErrorAction SilentlyContinue
```

Si el PID del lock responde en el sistema, no relances `start-auto-dev-full-cycle.ps1`.

---

## Estado actual

**Sin sesión activa** (lock ausente; último ciclo completó ~03:08 UTC).

Para arrancar una sola instancia:

```powershell
.\scripts\dev-agent\start-auto-dev-full-cycle.ps1 -NoPush
```

---

## Monitoreo

```powershell
Get-Content reports/auto-dev-orchestrator-log.jsonl -Wait -Tail 15
Get-Content reports/auto-dev-parallel-log.jsonl -Wait -Tail 10
Get-Content reports/epis2-dev-cycle-status.json
```

Evento duplicado evitado: `parallel-already-running` en `auto-dev-parallel-log.jsonl`.
