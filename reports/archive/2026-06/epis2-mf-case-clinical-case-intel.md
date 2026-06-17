# EPIS2 — Clinical-Case-Intel (MF-CASE-01…08)

> Simulador de casos clínicos sintéticos para alimentar pruebas EPIS2 y Evolab.  
> Patrón: `drug-intel` (scrape → staging → revisión humana → promote).  
> **Invariantes:** `is_synthetic=true`, tier `L0_synthetic`, IA no aprueba, staging ≠ SoT.

## Alcance SDEPIS2

| Microfase | Entrega |
|-----------|---------|
| MF-CASE-01 | Contrato Zod, servicio CLI, migración staging, fixture Synthea |
| MF-CASE-02 | Síntesis Ollama opcional (enriquecimiento es-CL) |
| MF-CASE-03 | API admin review + promote |
| MF-CASE-04 | Fixtures `SIM_*` + seed SQL `042` |
| MF-CASE-05 | Export escenarios YAML → `epis2-evolab` |
| MF-CASE-06 | Catálogo 10 casos (Synthea + MedEd fixture) |
| MF-CASE-07 | Fetch remoto JSON, pipeline catalog, gates calidad |
| MF-CASE-08 | Promote batch, verify seed, integración API batch |

## Arquitectura

```text
scrape (Synthea / catalog / meded-remote)
  → synthesize (Ollama opcional)
  → validate (anti-PHI)
  → load → clinical_case_staging
  → admin review + promote (API o CLI dev)
  → export-fixtures (simCases.ts + 042_*.sql)
  → export-evolab (YAML + sync epis2-evolab)
```

**Dos caminos a SoT (MF-CASE-08):**

1. **Migración `042_sim_clinical_cases_seed.sql`** — seed idempotente (CI/dev rápido).
2. **Staging + promote** — flujo con revisión humana (`--dev-approve` en dev).

## Catálogo SIM (10 casos)

| Código | Condición | Fuente |
|--------|-----------|--------|
| `SIM-HIPERTENSI-N-ac1e` | HTA | Synthea |
| `SIM-DIABETES-81dd` | DM2 | Synthea |
| `SIM-ASMA-BRONQUI-d583` | Asma | Synthea |
| `SIM-NEUMON-A-ADQ-e60b` | Neumonía | Synthea |
| `SIM-FIBRILACI-N--80e0` | FA | Synthea |
| `SIM-OBESIDAD-SIN-a015` | Obesidad | Synthea |
| `SIM-DISLIPIDEMIA-cd13` | Dislipidemia | Synthea |
| `SIM-EPOC-MODERAD-2b2f` | EPOC | Synthea |
| `SIM-INSUFICIENCI-cd9f` | IC | Synthea |
| `SIM-ASTHMA-c6be` | Asma docente | MedEd fixture |

UUIDs estables: prefijo `a0000002` / `b0000002` (`stableSimCaseUuids`).  
Catálogo paralelo a `DEMO-001…005` (`EPIS2-DEMO`).

## Ubicaciones clave

| Pieza | Ruta |
|-------|------|
| Contrato | `packages/contracts/src/clinicalCaseIntel.ts` |
| Servicio CLI | `services/clinical-case-intel/` |
| Staging DB | `database/migrations/041_clinical_case_staging.sql` |
| Seed SIM | `database/migrations/042_sim_clinical_cases_seed.sql` |
| Fixtures | `packages/test-fixtures/src/simCases.ts` |
| API admin | `apps/api/src/admin/routes.ts` + `clinicalCasePromote.ts` |
| Catálogo fixtures | `services/clinical-case-intel/fixtures/catalog.json` |
| Remote MedEd/PMC | `fixtures/meded-remote-sources.json` (solo JSON; sin HTML) |

## Comandos

```bash
# Pipeline completo (desarrollo)
npm run case-intel:scrape:catalog
npm run case-intel:validate -- --input data/clinical-cases/validated-<stamp>.json
npm run case-intel:export-fixtures -- --apply --input data/clinical-cases/validated-<stamp>.json
npm run case-intel:export-evolab -- --apply --input data/clinical-cases/validated-<stamp>.json

# Orquestación MF-CASE-07
npm run case-intel:pipeline:catalog
npm run case-intel:pipeline:catalog -- --apply --promote

# SoT MF-CASE-08
npm run db:migrate
npm run case-intel:verify-sim-seed
npm run case-intel:promote-catalog                    # directo, idempotente
npm run case-intel:promote-catalog -- --staging --dev-approve  # vía staging

# Opcional Ollama
npm run case-intel:synthesize

# Gates cierre
npm run quality:case-intel-catalog-gate
npm run quality:case-intel-promote-gate   # requiere DATABASE_URL + migrate 042
```

**Nota:** `export-fixtures` / `export-evolab` priorizan snapshots `synthesized` antiguos si no se pasa `--input`. Tras scrape de catálogo, usar el snapshot `validated` explícito.

## API admin (MF-CASE-03)

| Método | Ruta | Permiso |
|--------|------|---------|
| `GET` | `/api/admin/clinical-cases` | `audit.read` |
| `POST` | `/api/admin/clinical-cases/:id/review` | `admin.catalogs.write` |
| `POST` | `/api/admin/clinical-cases/promote` | `admin.catalogs.write` |

## Evolab (MF-CASE-05)

- Escenarios: `epis2-evolab/apps/evolution-lab/scenarios/sim-*-evolution-001.yaml`
- Sync fixtures: `packages/demo-fixtures/src/simCases.ts`
- Env: `EPIS2_EVOLAB_ROOT` (default `../epis2-evolab`)
- Manifiesto: `reports/clinical-case-evolab-sync.json`

## Gates verificados (sesión cierre)

```bash
npm run build -w @epis2/clinical-case-intel
npm run quality:case-intel-catalog-gate
npm run db:migrate && npm run case-intel:verify-sim-seed
npm run quality:case-intel-promote-gate
```

## Riesgos y límites

- **Sin scrape HTML PMC/MedEd** — solo `TeachingCase` JSON curado (anti-PHI).
- **Ollama opcional** — pipeline degrada sin error si no hay Ollama (invariante 15).
- **epis2-evolab** — cambios YAML/fixtures en repo hermano; commit separado.
- **Snapshots** — `data/clinical-cases/` en `.gitignore` (artefactos locales).

## Próximo paso sugerido

- ~~Integrar `quality:case-intel-promote-gate` en CI cuando Postgres esté disponible.~~ ✓ MF-CASE-09
- ~~Ampliar catálogo (>10) con más condiciones Synthea o casos docentes revisados.~~ ✓ MF-CASE-09 (12 casos)
- MF-CASE-10: evals assist con casos SIM en journey golden; documentar en `EPIS2_AI_TRAMO_EVALS`. ✓
- MF-CASE-11: golden v7 SIM (borrador→aprobación), matriz assist 12 casos, closure gate. ✓

## MF-CASE-11 — Cierre programa (2026-06-13)

| Entrega | Detalle |
|---------|---------|
| Golden v7 | `golden-v7-sim-journey` — evolución SIM → aprobación → auditoría |
| Matriz assist | 13 entradas cubriendo los 12 `caseCode` del catálogo |
| Gate unificado | `quality:case-intel-gate` incluye catalog + promote + assist |
| Signoff | `quality:case-intel-closure-gate` — artefactos MF-CASE-01…11 |

```bash
npm run quality:case-intel-closure-gate
```

## MF-CASE-10 — Evals assist SIM (2026-06-13)

| Entrega | Detalle |
|---------|---------|
| Matriz | `packages/test-fixtures/src/simAssistEvals.ts` — 6 entradas piloto |
| Golden v6 | `golden-v6-sim-assist` en `golden-clinical-journey.api.spec.ts` |
| Live evals | `npm run ai:evals:sim` → `reports/ai-evals-sim-latest.json` |
| Gate CI | `quality:case-intel-assist-gate` |

```bash
npm run quality:case-intel-assist-gate
npm run ai:evals:sim   # con dev:ai
```

## MF-CASE-09 — CI + catálogo 12 (2026-06-13)

| Entrega | Detalle |
|---------|---------|
| CI | `quality:case-intel-catalog-gate` + `quality:case-intel-promote-gate` tras `db:migrate` en `.github/workflows/ci.yml` |
| Local CI | `quality:case-intel-gate` en `run-local-ci.mjs` |
| Catálogo | +2 Synthea: depresión (`SIM-TRASTORNO-DE-9437`), ERC estadio 3 (`SIM-ENFERMEDAD-R-40f8`) |
| Gates dinámicos | `catalog.json` define N esperado (`scripts/quality/lib/case-intel-expected.mjs`, `catalogCanon.ts`) |
| Evolab | 12 escenarios `sim-*-evolution-001.yaml` |

```bash
npm run quality:case-intel-gate
npm run case-intel:pipeline:catalog -- --apply
```

## Cierre sesión (2026-06-13)

| Repo | Commit | Estado |
|------|--------|--------|
| EPIS2 | `da3fb62` | MF-CASE-10 assist + golden v6 |
| EPIS2 | `a1accaf` | MF-CASE-09 CI + catálogo 12 |
| epis2-evolab | `98205fb` | 12 escenarios SIM |

**Gates finales:** `quality:case-intel-closure-gate` · `verify-sim-seed` 12 EPIS2-SIM.

**Push:** `origin/master` en ambos repos.

## Cierre sesión histórico (2026-06-13)
