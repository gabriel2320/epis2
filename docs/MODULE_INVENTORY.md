# EPIS2 — Inventario de módulos

**Versión:** 1.0 · **Fecha:** 2026-06-15  
**Brújula:** [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md)

Clasificación: **core** · **labs** · **tools** · **archive** · **external**

Acción: **keep** · **consolidate** · **needs-review** · **archive** · **delete-later**

---

## Apps

| Path | Paquete | Zona | Acción | Notas |
|------|---------|------|--------|-------|
| `apps/web` | `@epis2/web` | core | keep | UI clínica; `@epis2/ai-client` OK; no `@mui/*` directo |
| `apps/api` | `@epis2/api` | core | keep | SoT HTTP; AI routes, CDS, clinical, FHIR frontera |

---

## Packages (monorepo)

| Path | Zona | Core Base? | Acción | Notas |
|------|------|------------|--------|-------|
| `packages/contracts` | core | Sí | keep | Zod compartido API/web |
| `packages/clinical-domain` | core | Sí | keep | CDS mapping, alertas demo |
| `packages/clinical-forms` | core | Sí | keep | **Único** Form Registry |
| `packages/command-registry` | core | Sí | keep | **Único** Command Registry |
| `packages/clinical-productivity` | core | Sí | keep | Grillas, acciones probables, textbox |
| `packages/design-system` | core | Sí | keep | Tokens base |
| `packages/epis2-ui` | core | Sí | keep | Componentes MD3, tema, print A5 |
| `packages/epis2-widgets` | core | Sí | keep | **Único** Widget Registry |
| `packages/ai-client` | core | Frontera | keep | Cliente HTTP IA para web |
| `packages/fhir-export` | core | Interop | keep | Solo frontera export |
| `packages/test-fixtures` | tools | Tests | keep | DEMO/SIM; no UI clínica |

---

## Services (runtime)

| Path | Zona | Core Base? | Acción | Notas |
|------|------|------------|--------|-------|
| `services/local-ai` | core | Opcional | keep | Runtime Ollama/OpenAI demo; no import desde web |
| `services/clinical-case-intel` | labs | No | needs-review | Case forge; export Evolab; promover a labs-only deps |
| `services/drug-intel` | labs | No | needs-review | Correlación fármacos; no SoT clínico |

---

## Repos hermanos (external)

| Repo | Zona | Acción | Contrato |
|------|------|--------|----------|
| `../epis2-evolab` | external | keep | HTTP sandbox, scenarios YAML, findings JSON |
| `../EPIS2-MedRepo` | external | keep | `knowledge-pack-*.json`; loader MF-FF-14 |
| `../Epis` | archive | archive | Donante legacy; manifest obligatorio |

---

## Database

| Path | Zona | Acción | Notas |
|------|------|--------|-------|
| `database/migrations` | core | keep | Cambios solo con MF autorizada |
| `database/tests` | tools | keep | `db:validate` |

---

## Scripts (métricas 2026-06-15)

| Área | Archivos aprox. | Zona | Acción |
|------|-----------------|------|--------|
| `scripts/quality/validate-*-gate.mjs` | ~240 | tools | consolidate → meta-gates |
| `scripts/quality/run-quality-*.mjs` | 3 | tools | keep (fast/clinical/full) |
| `scripts/architecture/` | ~20 | tools | keep |
| `scripts/dev-agent/` | ~30+ | tools | keep; no producto |
| `scripts/legacy-audit/` | ~10 | archive | keep for audit |
| `package.json` scripts | **419** total | tools | consolidate visibles a ~15 |

---

## Documentación

| Área | Cantidad | Acción |
|------|----------|--------|
| `docs/product/` | Canon vivo | keep; tablero stale → alinear |
| `docs/quality/` | Ledgers MF | keep |
| `reports/` | ~486 md | archive progresivo (>90 días → `reports/archive/`) |
| `migration/candidates/` | Fósiles EPIS | archive; no portar sin manifest |

---

## Áreas truncadas (needs-review)

Funcionalidad empezada en master; no borrar sin inventario MF.

| Área | Evidencia | Acción sugerida |
|------|-----------|-----------------|
| Tramos clínicos A–K | `validate-tramo-*-gate.mjs`, docs tramo | Matriz por tramo: demo / scaffold / dead |
| Olas M3 / TE / PA | gates `ola*`, `te-*`, `pa-*` | Agrupar bajo meta-gate UI o archivar |
| Three modes / Classic MD3 | `quality:three-modes-gate` | Keep secundario; no home |
| Paper planner extendido | múltiples `paper-planner-*` gates | Needs-review vs Base v0.1 |
| Drug intel en producto | `services/drug-intel` | Labs-only boundary |
| OpenClaw auto-dev | `scripts/dev-agent/openclaw-*` | Tools; L0 write allowlist |

---

## Fósiles (archive — no runtime)

| Elemento | Ubicación | Acción |
|----------|-----------|--------|
| OpenMRS / O3 / Carbon | `migration/`, audit scripts | archive — gates `no-legacy-dependencies` |
| Command Center como home | eliminado | ✓ censo-first |
| Dashboard como home | prohibido | secundario OK |
| Copia masiva EPIS | prohibido | manifest + ledger |

---

## Clasificación rápida para PRs

```text
¿Toca apps/web, apps/api, packages/clinical-* , command-registry, contracts?
  → core — exige quality:clinical o quality:full

¿Toca services/clinical-case-intel o drug-intel?
  → labs — no nuevas deps desde web

¿Solo scripts/quality o reports?
  → tools — quality:fast

¿Solo migration o reports históricos?
  → archive
```

---

## Próximo paso inventario

1. Completar filas **tramo A–K** con estado demo/scaffold/dead (hoja aparte o ampliar esta tabla).
2. Lista de gates huérfanos (en package.json pero programa cerrado) → candidatos a quitar de npm scripts.
3. Tag git `epis2-base-v0.1` cuando checklist en CURRENT_STATE esté ✓ en CI.
