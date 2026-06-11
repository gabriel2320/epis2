# EPIS2 ↔ Evolab (EpiLab) — Integración sin frontera cruzada

**Versión:** 1.0 · **Fecha:** 2026-06-10  
**Programa:** [EPIS2_PM03_AUTO_ORCHESTRATION.md](./EPIS2_PM03_AUTO_ORCHESTRATION.md)

> **Principio:** EPIS2 **observa** Evolab; nunca importa su código. Evolab vive en el repo hermano `epis2-evolab`.

---

## Frontera

| Permitido | Prohibido |
|-----------|-----------|
| Scripts puente (`evolab-bridge.mjs`) que ejecutan `npm run evolab:*` en el clone | Copiar archivos desde `epis2-evolab` a EPIS2 |
| Documentación y reportes JSON en `reports/` | Entrada en `legacy-import-manifest.json` |
| Variables `EPIS2_ROOT` / `EPIS2_EVOLAB_ROOT` en spawn | `import` de paquetes `@evolab/*` en apps EPIS2 |

Evolab usa `EPIS2_ROOT` para apuntar escenarios y validaciones al producto sin acoplar el monorepo.

---

## Repositorios

| Repo | Ruta típica | Rol |
|------|-------------|-----|
| **EPIS2** | `…/EPIS2` | Producto clínico, PM-03 orquestador |
| **epis2-evolab** | `…/epis2-evolab` (hermano) | Simulación, smoke, findings, evolución supervisada |

Clonar Evolab junto a EPIS2:

```bash
cd ..
git clone https://github.com/gabriel2320/epis2-evolab.git
cd epis2-evolab && npm install
```

---

## Variables de entorno

| Variable | Default | Uso |
|----------|---------|-----|
| `EPIS2_EVOLAB_ROOT` | `../epis2-evolab` desde raíz EPIS2 | Ruta al clone Evolab |
| `EPIS2_ROOT` | (inyectado por bridge) | Raíz EPIS2 pasada a scripts Evolab |
| `EPIS2_EVOLAB_OPTIONAL` | — | `1` → bridge hace skip con aviso si falta clone (exit 0) |
| `EPIS2_AUTO_DEV_EVOLAB` | off | `1` → PM-03 ejecuta doctor/smoke/validate en tramos |

En Evolab (no en EPIS2): `EPIS2_EVOLAB_DATABASE_URL`, Ollama, etc. — ver README del repo hermano.

---

## Comandos puente (EPIS2)

```bash
npm run evolab:doctor      # entorno + guards Evolab
npm run evolab:smoke       # escenarios tag smoke
npm run evolab:validate    # validación evolution/
npm run evolab:plan        # plan evolutivo (solo Evolab)
npm run evolab:evolve      # loop MAP-Elites (--generations N --budget-minutes M)
npm run evolab:stack       # stack Evolab (Postgres/Ollama del lab)
npm run evolab:findings -- --status open --limit 50
npm run evolab:queue
npm run dev:evolab:sync    # → reports/evolab-open-findings.json
```

Con clone ausente y solo lectura de gates:

```bash
EPIS2_EVOLAB_OPTIONAL=1 npm run evolab:doctor
```

---

## Agentes en Evolab

En `epis2-evolab` (no en EPIS2):

- **simulated-user** — recorre flujos clínicos contra `EPIS2_ROOT` / target configurado.
- **orchestrator** — loop PLAN → RUN → EVALUATE → FINDINGS; cola `human_review`.

EPIS2 solo invoca CLI/npm vía bridge; la lógica evolutiva permanece en el repo hermano.

---

## PM-03 — Evolab como capa QA

Cuando `EPIS2_AUTO_DEV_EVOLAB=1`:

```text
preconditions → evolab:doctor
tramo H-AUTO-2 (dual-chart) → evolab:smoke
tramo H-AUTO-4 (check/repair) → evolab:smoke
tramo H-AUTO-6 (cierre)       → evolab:validate
```

Evolab complementa gates EPIS2 (`quality:dual-chart-gate`, `check`, etc.) con simulación y hallazgos persistidos.

---

## Sesión integrada paralela

Arranque PM-03 + loop Evolab evolve en paralelo (solo PM-03 hace commit/push):

```powershell
.\scripts\dev-agent\start-auto-dev-integrated.ps1 -NoPush   # recomendado (seguro)
# o
npm run dev:auto:integrated -- --commit --continue-on-fail
```

| Track | Proceso | Git | Notas |
|-------|---------|-----|-------|
| **A — PM-03** | `dev:auto:orchestrate` | commit (+ push opcional) | track principal; bloquea cierre |
| **B — Evolab evolve** | `evolab:evolve` vía bridge | ninguno | background; sandbox; patching off |
| **C — Sync** | `dev:evolab:sync` | ninguno | inicio + cierre |

**Candados de seguridad (env forzado):**

| Variable | Valor | Efecto |
|----------|-------|--------|
| `EPIS2_EVOLAB_PATCHING_ENABLED` | `false` | Evolab no parchea EPIS2 |
| `EPIS2_EVOLAB_REQUIRE_HUMAN_APPROVAL` | `true` | hallazgos requieren revisión |
| `EPIS2_EVOLAB_LLM_CONCURRENCY` | `1` | cap Ollama compartido |
| `EPIS2_AUTO_DEV_TRAMO_PAUSE_MS` | `120000` | pausa entre tramos PM-03 |
| `EPIS2_OPENCLAW_MAX_POWER` | `1` | defaults L3 max-power |
| `EPIS2_OPENCLAW_POWER_LEVEL` | `L3` | patch-code-limited |
| `EPIS2_OPENCLAW_PATCHING_ENABLED` | `true` | safe-patch L0/L1 |
| `EPIS2_OPENCLAW_SAFE_RUN` | `true` | gates allowlist + quality:* |
| `EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL` | `true` | ollama/e2e/evolab |
| `EPIS2_OPENCLAW_AUTHORIZE_CODE` | `true` | parches tier L1 |
| `EPIS2_OPENCLAW_GIT_WRITE` | `false` | OpenClaw no commit/push |
| `EPIS2_OPENCLAW_READ_ENV` | `false` | solo `.env.example` |

Ver [EPIS2_OPENCLAW_INTEGRATION.md](./EPIS2_OPENCLAW_INTEGRATION.md) § Candados.

Logs: `reports/auto-dev-parallel-log.jsonl`, `reports/evolab-evolve-parallel.log`.

---

## Escenarios dual-chart

Tras cambios en modos de chart (H-AUTO-2 / ADR-002), ejecutar smoke Evolab además de `quality:dual-chart-gate`:

- Escenarios declarativos en Evolab con tag `smoke` y rutas bajo `/dev/chart-modes`.
- Detalle de escenarios: `epis2-evolab/apps/evolution-lab` y `docs/evolution/` en ese repo.

---

## Gates

```bash
npm run quality:evolab-bridge-gate
npm run quality:pm03-orchestration-gate   # incluye bridge gate
```

---

## Referencias

- [EPIS2_PM03_AUTO_ORCHESTRATION.md](./EPIS2_PM03_AUTO_ORCHESTRATION.md)
- [EVOLAB_ROADMAP](https://github.com/gabriel2320/epis2-evolab/blob/master/docs/evolution/EVOLAB_ROADMAP.md)
- `scripts/dev-agent/evolab-bridge.mjs`
