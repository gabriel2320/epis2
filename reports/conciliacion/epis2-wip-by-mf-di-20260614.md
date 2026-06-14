# EPIS2 — WIP agrupado por MF-DI (inventario F0)

**Fecha:** 2026-06-14 · **Sesión:** S1 PROG-CONCILIACION-TRIADA · **HEAD committed:** `5b92002`  
**Total líneas porcelain:** 105 · **Ledger:** `docs/quality/di-ledger.json` (10/10 DONE, **gitPending**)

---

## MF-DI-01 — Contexto clínico denso

| Archivo | Estado |
|---------|--------|
| `apps/api/src/clinical/patientContextDense.ts` | nuevo |
| `packages/clinical-domain/src/clinicalContextDense.ts` | nuevo |
| `packages/clinical-domain/src/clinicalContextDense.test.ts` | nuevo |
| `apps/web/src/components/chart/ClinicalContextDenseStrip.tsx` | nuevo |
| `apps/web/src/components/chart/ClinicalContextDenseStrip.test.tsx` | nuevo |
| `apps/web/src/components/EpisClinicalContextPane.tsx` | mod |
| `apps/web/src/components/chart/ClinicalShell.tsx` | mod |
| `apps/web/src/components/clinical-summary/PatientClinicalSummaryGrid.tsx` | mod |
| `apps/web/src/pages/DualChartPatientPage.tsx` | mod |
| `packages/contracts/src/clinicalSummary.ts` | mod |
| `packages/design-system/src/copy/es.ts` | mod |

---

## MF-DI-02 — Memoria operacional

| Archivo | Estado |
|---------|--------|
| `apps/api/src/user/**` | nuevo (routes, logic, tests) |
| `apps/web/src/api/userOperationalMemoryApi.ts` | nuevo |
| `apps/web/src/clinical/useOperationalMemory.ts` | nuevo |
| `apps/web/src/clinical/recentPatients.ts` | mod |
| `packages/contracts/src/operationalMemory.ts` | nuevo |
| `database/migrations/044_user_operational_memory.sql` | nuevo |
| `database/tests/migration-044-user-operational-memory.test.mjs` | nuevo |
| `apps/api/src/db/schema.ts` | mod |
| `apps/api/src/db/rls.ts` | mod |

---

## MF-DI-03 — Autocomplete ranking

| Archivo | Estado |
|---------|--------|
| `apps/api/src/catalog/medicationRank.ts` | nuevo |
| `packages/clinical-domain/src/catalogFrequencyRank.ts` | nuevo |
| `packages/clinical-domain/src/catalogFrequencyRank.test.ts` | nuevo |
| `apps/web/src/clinical/MedicationCatalogAutocomplete.tsx` | mod |
| `apps/web/src/clinical/useCommandDictionarySuggestions.ts` | mod |

---

## MF-DI-04 — Prefill CE-6

| Archivo | Estado |
|---------|--------|
| `packages/clinical-forms/src/command-slot-prefill.ts` | mod |
| `packages/clinical-forms/src/context-clinical-prefill.ts` | mod |
| `packages/clinical-forms/src/chronic-control-prefill.ts` | nuevo |
| `packages/command-registry/src/slots.ts` | mod |
| `packages/command-registry/src/definitions.ts` | mod |
| `packages/clinical-forms/src/factory.ts` | mod |
| `apps/web/src/pages/GeneratedClinicalFormPage.tsx` | mod |
| `apps/web/src/clinical/generated-form/GeneratedFormSections.tsx` | mod |

---

## MF-DI-05 — Acciones probables

| Archivo | Estado |
|---------|--------|
| `packages/command-registry/src/probableActions.ts` | nuevo |
| `packages/command-registry/src/probableActions.test.ts` | nuevo |
| `apps/web/src/components/chart/ClinicalProbableActionsPanel.tsx` | nuevo |
| `apps/web/src/components/chart/ClinicalProbableActionsPanel.test.tsx` | nuevo |

---

## MF-DI-06 — Sugerencias silenciosas

| Archivo | Estado |
|---------|--------|
| `packages/clinical-domain/src/silentSuggestions/**` | nuevo |
| `packages/clinical-domain/src/comorbiditySignals.ts` | nuevo |
| `apps/web/src/components/cds/**` | nuevo |
| `apps/web/src/clinical/useSilentClinicalSuggestions.ts` | nuevo |

---

## MF-DI-07 — Plantillas vivas

| Archivo | Estado |
|---------|--------|
| `packages/clinical-forms/src/live-templates/**` | nuevo |
| `packages/clinical-domain/src/index.ts` | mod |

---

## MF-DI-08 — Timeline filtrable

| Archivo | Estado |
|---------|--------|
| `apps/api/src/clinical/timelineClinical.ts` | nuevo |
| `apps/api/src/clinical/timelineClinical.test.ts` | nuevo |
| `apps/api/src/clinical/routes.ts` | mod |
| `apps/web/src/components/chart/timeline/**` | nuevo |
| `apps/web/src/components/chart/sections/TraditionalEvolutionSection.tsx` | mod |
| `apps/web/src/api/clinicalApi.ts` | mod |

---

## MF-DI-09 — Microjourneys

| Archivo | Estado |
|---------|--------|
| `packages/clinical-productivity/src/microjourneys/**` | nuevo |
| `packages/clinical-productivity/src/admin/**` | nuevo |
| `apps/web/src/clinical/generated-form/PostSaveMicrojourneyPanel.tsx` | nuevo |
| `apps/web/src/clinical/generated-form/validateGeneratedFormAdmin.ts` | nuevo |
| `apps/web/src/clinical/generated-form/useGeneratedFormDraftPersistence.ts` | mod |

---

## MF-DI-10 — Signoff + gates + docs

| Archivo | Estado |
|---------|--------|
| `scripts/quality/validate-di-*.mjs` | nuevo (9 gates) |
| `scripts/quality/di-next.mjs` | nuevo |
| `e2e/di-clinical-secretary-journey.spec.ts` | nuevo |
| `docs/quality/di-ledger.json` | nuevo |
| `docs/quality/DI_CLINICAL_SECRETARY_SIGNOFF_CHECKLIST.md` | nuevo |
| `docs/product/EPIS2_PROG_DETERMINISTIC_INTELLIGENCE.md` | nuevo |
| `reports/epis2-mf-di-*.md` | nuevo (10) |
| `reports/epis2-prog-di-close-2026.md` | nuevo |
| `package.json` | mod (scripts quality:di-*) |

---

## Transversal (varios MF)

| Archivo | Notas |
|---------|-------|
| `apps/api/src/app.ts` | rutas user + clinical |
| `packages/command-registry/**` | dictionary, assist-route, index |
| `packages/clinical-forms/**` | types, index, tests |
| `packages/clinical-productivity/package.json` | exports microjourneys |
| `packages/contracts/src/index.ts` | re-exports |
| `apps/web/src/query/queryKeys.ts` | queries nuevas |
| `apps/web/src/components/chart/TraditionalEhrMode.tsx` | integración panels |
| `apps/web/src/components/chart/sections/index.tsx` | timeline section |
| `e2e/dual-chart-modes.spec.ts` | regresión dual-chart |

---

## Commit F2 propuesto

Un solo commit **ENT-DI-01** con todos los paths anteriores + `reports/conciliacion/**` de S1.
