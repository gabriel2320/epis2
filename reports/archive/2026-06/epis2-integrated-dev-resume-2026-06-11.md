# EPIS2 — Reanudación desarrollo automático (PM-03 + Evolab)

**Fecha:** 2026-06-11  
**Commit base:** `b152e70` — feat(dev): PM-03 paralelo integrado con puente Evolab  
**Modo:** `-NoPush` (commit sí, push no)

---

## Hecho en esta reanudación

| Paso | Resultado |
|------|-----------|
| `npm run stack:dev` | Postgres OK (sesión previa) |
| `npm run dev:api` | API `:3001` health 200 |
| `npm run check` | OK (fix lint `evolab-sync.mjs`) |
| `quality:pm03-orchestration-gate` | OK |
| `quality:evolab-bridge-gate` | OK |
| `dev:evolab:sync` | 15 hallazgos abiertos → `reports/evolab-open-findings.json` |
| Commit integración PM-03 | `b152e70` |
| `start-auto-dev-integrated.ps1 -NoPush` | **En ejecución** |

---

## Procesos activos

| Track | PID | Notas |
|-------|-----|-------|
| Launcher integrado | 7644 | PowerShell wrapper |
| PM-03 orquestador | 5924 | `dev:auto:orchestrate --commit --continue-on-fail` |
| Evolab evolve (background) | 30016 | 2 gen, 300 min budget → `reports/evolab-evolve-parallel.log` |

**Tramo actual:** H-AUTO-1 (Terminología + diccionario comandos)  
**Tramo 0:** FAILED — omitido con `--resume` (stack ya activo)

---

## Seguridad (sin cambios)

- `EPIS2_EVOLAB_PATCHING_ENABLED=false`
- `EPIS2_EVOLAB_REQUIRE_HUMAN_APPROVAL=true`
- Evolab en repo hermano; solo bridge HTTP a API EPIS2
- Sin `CURSOR_API_KEY` → tramos Tier X en cola IDE

---

## Monitoreo

```powershell
Get-Content reports/auto-dev-parallel-log.jsonl -Wait -Tail 15
Get-Content reports/auto-dev-orchestrator-log.jsonl -Wait -Tail 15
Get-Content reports/auto-dev-6h-log.jsonl -Wait -Tail 15
Get-Content reports/evolab-evolve-parallel.log -Wait -Tail 30
Get-Content reports/auto-dev-cursor-queue.jsonl -Tail 5
```

Cola Cursor tramo 1: `reports/auto-dev-cursor-prompt-tramo-1.md`

---

## Avisos

1. **Working tree sucio** — prompts `dev:session` y logs en vivo; el orquestador puede mezarlos en commits por tramo. Opcional: `git stash push -m session-reports -- reports/` antes del próximo ciclo.
2. **Sesión scraper paralela** — no reiniciar Postgres/API compartidos; Evolab solo hace HTTP a `:3001`.
3. **Tramo 4 falló en sesión anterior** — revisar `auto-dev-orchestrator-log.jsonl` al cierre.
4. **15 hallazgos Evolab abiertos** — revisión humana antes de promover escenarios.

---

## Próximo paso manual (opcional)

- Abrir `@reports/auto-dev-cursor-prompt-tramo-1.md` en Cursor si el tramo requiere Tier X.
- Al cierre: `npm run dev:agent:close` + gates (`check`, `test`, `db:validate`).
