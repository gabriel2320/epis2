# EPIS2 — Proceso continuo activo (OpenClaw + Ollama + Evolab)

**Inicio ciclo:** 2026-06-11T03:04:40Z  
**Commit base:** `12836fc`  
**Modo:** `-NoPush` · L3 MAX POWER · 6 h máx

---

## Estado: EN EJECUCIÓN

No se lanzó ciclo duplicado — sesión previa activa.

| Proceso | PID | Rol |
|---------|-----|-----|
| Launcher full-cycle | 20964 | `start-auto-dev-full-cycle.ps1 -NoPush` |
| PM-03 orquestador | 11120 | `dev:auto:orchestrate --commit --continue-on-fail` |
| Evolab evolve (bg) | 30112 | 2 gen · 300 min → `reports/evolab-evolve-parallel.log` |

**Tramo actual:** H-AUTO-1 ✓ DONE → pausa 120s → siguiente (resume ledger)  
**Subagentes activos:**

| Capa | Estado |
|------|--------|
| **OpenClaw L3** | brief `reports/openclaw-latest-brief.md` · 8 skills en `.openclaw/epis2/` |
| **Ollama nativo** | plan MF-183 · `dev:agent:ollama-auto` post-tramo (dry-run) |
| **Cursor Tier X** | cola IDE → `reports/auto-dev-cursor-queue.jsonl` (sin `CURSOR_API_KEY`) |
| **Evolab** | 18 hallazgos abiertos · evolve en background |

---

## Variables de seguridad

```
EPIS2_AUTO_DEV_OPENCLAW=1
EPIS2_AUTO_DEV_OLLAMA=1
EPIS2_AUTO_DEV_OLLAMA_APPLY=0
EPIS2_EVOLAB_PATCHING_ENABLED=false
EPIS2_OPENCLAW_GIT_WRITE=false
EPIS2_OPENCLAW_MAX_POWER=1
```

---

## Monitoreo

```powershell
Get-Content reports/auto-dev-orchestrator-log.jsonl -Wait -Tail 15
Get-Content reports/epis2-dev-cycle-log.jsonl -Wait -Tail 15
Get-Content reports/epis2-dev-cycle-status.json
Get-Content reports/evolab-evolve-parallel.log -Wait -Tail 20
Get-Content reports/auto-dev-cursor-queue.jsonl -Tail 5
```

Estado unificado: `reports/epis2-dev-cycle-status.json`

---

## Acción manual (ahora)

1. **Cursor tramo 1** (si Tier X pendiente): `@reports/auto-dev-cursor-prompt-tramo-1.md` + `@reports/openclaw-latest-brief.md`
2. **Revisar plan Ollama L0** (dry-run): `reports/dev-agent-ollama-write-plan.json` — apply solo con `npm run dev:agent:ollama-write -- --apply`
3. **Hallazgos Evolab:** `reports/evolab-open-findings.json` — aprobación humana obligatoria

---

## Fix aplicado (pendiente commit)

`auto-dev-6h-runner.mjs`: mensaje git commit ASCII-only (`tramo-N-ID`) para evitar pathspec en Windows con nombres unicode/`+`.

---

## Ledger tramos

| Order | ID | Estado |
|-------|-----|--------|
| 0 | H-AUTO-0 | FAILED |
| 1 | H-AUTO-1 | DONE |
| 2 | H-AUTO-2 | FAILED (previo) |
| 3 | H-AUTO-3 | PENDING |
| 4 | H-AUTO-4 | FAILED (previo) |
| 5 | H-AUTO-5 | DONE |
| 6 | H-AUTO-6 | FAILED (previo) |

`--continue-on-fail` + `--resume` avanza tramos pendientes.
