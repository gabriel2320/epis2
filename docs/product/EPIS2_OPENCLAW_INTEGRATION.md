# EPIS2 — OpenClaw (L0 manual · L3 MAX POWER auto-dev)

**Versión:** 1.2 · **Fecha:** 2026-06-11  
**Programa:** [EPIS2_DEV_AGENT_ORCHESTRATION.md](./EPIS2_DEV_AGENT_ORCHESTRATION.md) · [EPIS2_PM03_AUTO_ORCHESTRATION.md](./EPIS2_PM03_AUTO_ORCHESTRATION.md)

> **Principio:** OpenClaw **L3 MAX POWER** en auto-dev — patch L0/L1, safe-run amplio, ollama-auto; Cursor/humano aprueban; **L5 prohibido**.

Patrón adaptado desde EPIS MF-81A (donor `../Epis`) — **sin importar código EPIS**; agentes y gates EPIS2-native.

---

## Frontera

| Permitido | Prohibido |
|-----------|-----------|
| Brief/handoff read-only en `.agent-runs/openclaw/` | Copiar `.openclaw/epis/` desde EPIS |
| Skills EPIS2 en `.openclaw/epis2/` | Import masivo donor sin manifest |
| Invocar gates sugeridos (humano/Cursor) | Commits/push autónomos desde OpenClaw |
| L3: `openclaw:safe-patch` L0/L1 | L5 coder autónomo |
| L3: `openclaw:safe-run` + `quality:*` | Commits/push desde OpenClaw |
| Comandos condicionales (ollama, e2e) | Auto-aprobación clínica · lectura `.env` |

---

## Arquitectura

```text
Humano
   │
   ├── dev:session [--openclaw] ──▶ brief + openclaw-latest-brief.md
   │
   ├── OpenClaw reviewers (read-only, skills .openclaw/epis2/)
   │        │
   │        └──▶ handoff ──▶ Cursor (implementación supervisada)
   │
   └── PM-03 (EPIS2_AUTO_DEV_OPENCLAW=1) ──▶ brief inicio · handoff cierre
```

Complementa (no reemplaza):

- **Ollama dev** — plan L0 / write docs
- **Evolab** — simulación QA repo hermano
- **Cursor SDK** — tramos Tier X PM-03

---

## Microagentes EPIS2

| ID | Agente | Foco |
|----|--------|------|
| `security` | Security/PHI | `.env.example`, invariantes, legacy audit |
| `clinical-safety` | Clinical Safety | clinicalSafety, draftStates, decision rules |
| `eval` | AI Eval | evals, blueprints assist |
| `architecture` | Architecture/Legacy | canon, manifest, architecture:validate |
| `golden` | Golden Journey | e2e, golden journey |
| `ledger` | Microphase Ledger | ledger, tablero |
| `release` | Release/Gates | check, test, local-ci |
| `ux` | UX/M3 | apps/web, three modes, M3 gates |
| `programming` | Programming / OpenClaw apoyo | PM-03, Ollama route, safe-run, cursor queue, dev-cycle |

Skills: `.openclaw/epis2/skills/*/SKILL.md`

### Agente `programming` (L3 apoyo)

Orquesta autodesarrollo supervisado — **no** coder L5. Skill: `.openclaw/epis2/skills/epis2-programming-agent/SKILL.md`.

```bash
# Slice de comandos + brief por tramo
npm run openclaw:programming -- --tramo 2
npm run openclaw:programming -- --mf H-AUTO-2 --json
```

Incluido en `suggestAgents` y tramos H-AUTO-0…4 vía `AUTO_DEV_TRAMO_AGENTS`. Artefacto: `reports/openclaw-programming-latest.md`.

---

## Comandos

```bash
# Brief read-only (indexa archivos + gates sugeridos)
npm run openclaw:brief -- --mf MF-TRAMO-J --agents security,ux,golden

# Agentes auto-sugeridos por tramo/fase/archivos
npm run openclaw:brief -- --mf auto --agents auto

# Handoff post-revisión (opcional --notes reviewer-notes.md)
npm run openclaw:handoff -- --mf MF-TRAMO-J --agents security,ux,golden

# Sesión dev con brief OpenClaw incluido
npm run dev:session -- --openclaw
# Cursor: @reports/dev-agent-brief.md @reports/openclaw-latest-brief.md

# Gate integración
npm run quality:openclaw-gate

# Candados activos
npm run openclaw:policy

# Ejecutar gate / ollama (L3 max-power)
npm run openclaw:safe-run -- --cmd "npm run check"
npm run openclaw:post-tramo -- --tramo 2
npm run openclaw:programming -- --tramo 2
npm run openclaw:safe-patch -- --proposal .agent-runs/openclaw/patch-proposal.json
```

---

## MAX POWER (L3 — default auto-dev)

`EPIS2_OPENCLAW_MAX_POWER=1` activa:

| Capacidad | Comando |
|-----------|---------|
| Gates allowlist + `npm run quality:*` | `openclaw:safe-run` |
| Ollama-auto, e2e, evolab | condicional autorizado |
| Parches reports/docs (L0) + scripts dev (L1) | `openclaw:safe-patch` |
| Post-tramo verify + ollama-auto + sync | `openclaw:post-tramo` |

**L4** (`POWER_LEVEL=L4`): solo safe-run ampliado (`test:e2e:*`, `dev:agent:*`) — sin patch.

---

## Candados de seguridad (auto-dev)

Forzados en scripts PowerShell y spawn PM-03:

| Variable | Auto-dev MAX | Manual L0 |
|----------|--------------|-----------|
| `EPIS2_OPENCLAW_MAX_POWER` | `1` | `0` |
| `EPIS2_OPENCLAW_POWER_LEVEL` | `L3` | `L0` |
| `EPIS2_OPENCLAW_PATCHING_ENABLED` | `true` | `false` |
| `EPIS2_OPENCLAW_SAFE_RUN` | `true` | `false` |
| `EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL` | `true` | `false` |
| `EPIS2_OPENCLAW_AUTHORIZE_CODE` | `true` | `false` |
| `EPIS2_OPENCLAW_GIT_WRITE` | `false` | `false` |
| `EPIS2_OPENCLAW_READ_ENV` | `false` | `false` |

Detalle: `.openclaw/epis2/policies/epis2-auto-dev-locks.md`

---

## Variables de entorno

| Variable | Default | Uso |
|----------|---------|-----|
| `EPIS2_OPENCLAW_MAX_POWER` | off / `1`* | Defaults L3 auto-dev |
| `EPIS2_OPENCLAW_SESSION` | off | `dev:session --openclaw` |
| `EPIS2_AUTO_DEV_OPENCLAW` | off* | Integración PM-03 |
| `EPIS2_OPENCLAW_POWER_LEVEL` | `L3`* / `L0` | Perfil L0–L4 (L5 prohibido) |
| `EPIS2_OPENCLAW_PATCHING_ENABLED` | `true`* | safe-patch |
| `EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL` | `true`* | ollama/e2e/evolab |
| `EPIS2_OPENCLAW_AUTHORIZE_CODE` | `true`* | parches L1 |

En `.env.example` (sección OpenClaw).

---

## PM-03 — OpenClaw en autodesarrollo 6 h

Con `EPIS2_AUTO_DEV_OPENCLAW=1`:

| Momento | Acción |
|---------|--------|
| Preconditions | `openclaw:policy` + workspace `.openclaw/epis2/` |
| Pre-orquestación | `openclaw:brief` + `dev:openclaw:sync` |
| Pre cada tramo H-AUTO-N | `openclaw:tramo --tramo N --phase brief` |
| Post tramos 2, 4, 6 | `openclaw:tramo --phase handoff` + `openclaw:post-tramo` |
| Cierre orquestador | `openclaw:handoff` + sync |
| Tramo 0 runner | `dev:session --openclaw` |
| Prompts Cursor Tier X | `@reports/openclaw-latest-brief.md` |

```bash
npm run openclaw:tramo -- --tramo 2 --phase brief
npm run openclaw:verify-tramo -- --tramo 2
npm run dev:openclaw:sync
```

```powershell
.\scripts\dev-agent\start-auto-dev-6h.ps1
.\scripts\dev-agent\start-auto-dev-integrated.ps1
```

Artefactos: `reports/openclaw-latest-brief.md` · `reports/openclaw-latest-handoff.md` · `reports/openclaw-auto-dev-index.json`

---

## Flujo operativo

1. Declarar MF / tramo y alcance (SDEPIS2).
2. Generar brief: `npm run openclaw:brief -- --mf MF-* --agents auto`.
3. Ejecutar revisores read-only con skills en `.openclaw/epis2/skills/`.
4. Consolidar hallazgos (sin secretos).
5. Generar handoff: `npm run openclaw:handoff -- --notes .agent-runs/openclaw/notes.md`.
6. Cursor aplica cambios con gates estándar.

---

## Gates post-handoff

```bash
npm run check
npm run test
npm run architecture:validate
npm run db:validate
```

---

## Ciclo dev unificado (OpenClaw + Ollama + Evolab)

OpenClaw **orquesta** el ciclo PM-03; Ollama planifica localmente; Evolab valida hallazgos.

Ver **[EPIS2_DEV_CYCLE_OPENCLAW.md](./EPIS2_DEV_CYCLE_OPENCLAW.md)**.

```powershell
.\scripts\dev-agent\start-auto-dev-full-cycle.ps1
npm run dev:auto:cycle -- --commit --parallel
npm run dev:cycle:sync
npm run quality:openclaw-cycle-gate
```

Estado unificado: `reports/epis2-dev-cycle-status.json`

---

## Referencias

- Donor (solo lectura conceptual): `../Epis/docs/agents/OPENCLAW_EPIS_INTEGRATION.md`
- [EPIS2_DEV_CYCLE_OPENCLAW.md](./EPIS2_DEV_CYCLE_OPENCLAW.md)
- [EPIS2_EVOLAB_INTEGRATION.md](./EPIS2_EVOLAB_INTEGRATION.md)
- [EPIS2_PM03_AUTO_ORCHESTRATION.md](./EPIS2_PM03_AUTO_ORCHESTRATION.md)
- `scripts/dev-agent/openclaw-lib.mjs`
