# EPIS2 — Inventario de módulos

**Versión:** 1.2 · **Fecha:** 2026-06-18  
**Brújula:** [`EPIS2_CURRENT_STATE.md`](EPIS2_CURRENT_STATE.md) · **Knip baseline (KNIP-04):** 0 unused files · 0 unused deps · 0 unlisted · 0 duplicate exports

Clasificación: **core** · **labs** · **tools** · **archive** · **external**

Acción: **keep** · **consolidate** · **needs-review** · **archive** · **delete-later**

---

## Apps

| Path | Paquete | Zona | Acción | Notas |
|------|---------|------|--------|-------|
| `apps/web` | `@epis2/web` | core | keep | UI clínica; CICA `/app/*`; legacy `/espacio/*`; `design-agents/` lab (podado MF-KNIP-02-A) |
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
| `packages/epis2-ui` | core | Sí | keep | Componentes MD3, tema (`theme/theme.ts`, `typography-rules.ts`); CICA SoT `clinicalChartTabRegistry.ts` |
| `packages/epis2-widgets` | core | Sí | keep | **Único** Widget Registry |
| `packages/ai-client` | core | Frontera | keep | Cliente HTTP IA para web |
| `packages/fhir-export` | core | Interop | keep | Solo frontera export |
| `packages/test-fixtures` | tools | Tests | keep | DEMO/SIM; no UI clínica |
| `packages/clinical-rules` | core | Reglas | keep | Demo rules; `@epis2/lab-dictionary` |
| `packages/lab-dictionary` | core | Lexicon | keep | Catálogo labs ES-CL |
| `packages/clinical-lexicon-es-cl` | core | Lexicon | keep | Cadena lexicon build |
| `packages/drug-dictionary-cl` | labs | Lexicon | keep | No dep directa en clinical-rules (MF-KNIP-03) |

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

## Ponytail trim (2026-06-18 — PROG-PONYTAIL-TRIM ✓ técnico)

| MF | Resultado |
|----|-----------|
| KNIP-00…04 | Knip instalado; 0 files/deps/unlisted/duplicates |
| PONY-02…07 | CICA registry, stubs ocultos, rutas derivadas, tabs SoT |
| PONY-GATE-01 | 8 gates → `PROG-PONYTAIL-TRIM` archived · merge `master` @ `b2d6a00` |

Evidencia: `reports/epis2-mf-pony-gate-01-close.md`, `reports/archive/2026-06/epis2-mf-pony-*-close.md`, `reports/knip-audit-pony-2026-06-18.md`.

| Zona podada | Acción | Notas |
|-------------|--------|-------|
| `apps/web/design-agents/` (parcial) | delete-later | Agentes huérfanos; core tests + `schemas.ts` |
| `apps/web` barrels `components/*/index.ts` | delete-later | Imports directos a subpaths |
| `packages/epis2-ui/theme/foundations/**` | delete-later | Re-exports muertos; SoT en `theme/*.ts` |
| `packages/epis2-ui/cica/CICA_CHART_TAB_REGISTRY.ts` | delete-later | SoT: `clinicalChartTabRegistry.ts` |
| `apps/api/src/db.ts` | delete-later | Shim; usar `db/client.js` |

**Knip (PROG-PRODUCT-MAP ✓):** KNIP-04 **0** · exports **114** · audits en `reports/archive/2026-06/knip-audit-product-map-*`.

---

## Próximo paso inventario

1. **PROG-PURGE-CICA** — MF-PURGE-05 ✓ `@legacy-runtime` · **MF-PURGE-09** (design-agents).
2. Completar filas **tramo A–K** con estado demo/scaffold/dead (hoja aparte o ampliar esta tabla).
3. Tag **`epis2-base-v0.1`** ✓ (MF-RELEASE-BASE-01 · [`epis2-prog-product-map-close.md`](../reports/epis2-prog-product-map-close.md)).
