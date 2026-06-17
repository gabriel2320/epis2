# EPIS2 — Exclusiones de alcance para agentes

**Versión:** 1.0 · **Fecha:** 2026-06-16 · **Programa:** PROG-PURGE-CICA · MF-PURGE-07

> **Regla:** lo archivado existe como **evidencia histórica**. No planificar, no implementar, no reabrir salvo MF autorizada explícita del operador.

**Brújula activa:** [`EPIS2_CURRENT_STATE.md`](../EPIS2_CURRENT_STATE.md) · **Purga:** [`EPIS2_PURGE_ARCHIVE_PLAN.md`](../product/EPIS2_PURGE_ARCHIVE_PLAN.md)

---

## Fuente de verdad (solo estos para decisiones)

| Prioridad | Documento |
|-----------|-----------|
| 1 | `docs/EPIS2_CURRENT_STATE.md` |
| 2 | `docs/AGENT_CONTEXT_MINIMAL.md` |
| 3 | `docs/CONSOLIDATION_FREEZE.md` |
| 4 | `docs/product/PRODUCT_INVARIANTS.md` |
| 5 | `reports/dev-agent-brief.md` + **un** `dev-agent-prompt-<activo>.md` |
| 6 | Plan vigente CICA/PURGE (este doc § Programas activos) |

**No** usar como plan: tablero stale, reportes archivados, playbooks v1, planes tramo/ola en `docs/product/EPIS2_TRAMO_*`.

---

## Rutas fuera de alcance (no indexar / no planificar)

### Reportes y sesiones históricas

```text
reports/archive/**          ← 481+ reportes; solo lectura forense
reports/epis2-auditoria-*   ← si existieran en raíz
reports/epis2-mf-*            ← MF cerradas (salvo mf-con-* activos en raíz)
dev-agent-prompt-tramo-*      ← en archive o obsoletos
```

### Documentación superseded

```text
docs/archive/agent-playbooks/**
docs/product/EPIS2_TRAMO_*_PLAN.md
docs/product/EPIS2_TRAMO_*_INVENTORY.md
docs/product/EPIS2_GLOBAL_DEV_PLAN.md   ← histórico; no planificar fases A/B
docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md
docs/product/EPIS2_TABLERO.md             ← índice humano, no fuente de verdad
```

### Código legacy congelado (no expandir)

```text
migration/candidates/**     ← fósiles EPIS/OpenMRS/Carbon
apps/web rutas /espacio/*   ← fallback; no rediseñar salvo bugfix o redirect CICA
three modes / classic MD3   ← secundario; no home
tramos A–K scaffolds        ← demo; no nuevos IDC panels
```

### Subagentes archivados

No adjuntar prompts ni seguir canon de:

| ID | Motivo archivo |
|----|----------------|
| `tramo-implementer` | Tramos A–K cerrados/congelados |
| `m3-guardian` | Ola M3 superseded por CICA |
| `layers-integrator` | RAD/M3 layers histórico |
| `ci-parity` | Semana dev-automation archivada |

**Activos:** `golden-guardian`, `gate-runner`, `ollama-dev-writer`, `ollama-clinical`, `ledger-keeper` (solo MF abierta).

---

## Programas cerrados (no reabrir)

Índice completo: [`ARCHIVED_PROGRAMS_INDEX.md`](./ARCHIVED_PROGRAMS_INDEX.md)

| Programa | Sustituido por |
|----------|----------------|
| PROG-STRENGTHEN | Base v0.1 + gates meta |
| PROG-FICHA-FIRST | Censo + CICA redirects |
| Tramos A–K / IDC olas | CICA `/app/*` |
| Three modes / Command Center home | CICA + censo |
| Ola M3 / NORM / paper planner extendido | CICA clean room |
| OpenClaw auto-dev | `dev:session` + brief |
| PROG-UX-LAB | ✓ cerrado — mantenimiento CICA |

---

## Programas activos (2026-06-16)

| Programa | Alcance permitido |
|----------|-------------------|
| **PROG-PURGE-CICA** | Archivar, referenciar, exclusiones agente |
| **CICA clean room** | `apps/web/src/cica/`, `packages/epis2-ui/src/cica/` |
| **Congelamiento** | Fixes, seguridad, docs — no features clínicas nuevas |

---

## Excepción explícita

Reabrir camino archivado **solo** si el operador declara en el chat:

```text
MF-* autorizada · EPIS2_ALLOW_ARCHIVED_SCOPE=1 · <programa> · allowlist
```

Sin esa triple declaración → **detenerse** y proponer alternativa en alcance CICA/core.

---

## Referencias cruzadas (punteros, no plan)

| Necesitas… | Lee… |
|------------|------|
| Qué se movió en lote 6 | [`reports/archive/2026-06/README.md`](../../reports/archive/2026-06/README.md) |
| Módulos truncados | [`TRUNCATED_MODULES.md`](./TRUNCATED_MODULES.md) |
| Ramas git archivadas | [`BRANCH_REGISTRY.md`](./BRANCH_REGISTRY.md) |
| Cronología fases | [`PHASE_HISTORY.md`](./PHASE_HISTORY.md) |
