# MF-KNIP-02-B — Cierre (poda legacy web + barrels)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM · **Zona:** `apps/web` legacy components + barrel indexes

## Alcance

Poda delete-safe de componentes y barrels sin import runtime — imports directos a subpaths ya en uso en CICA, `/espacio/*` y páginas activas.

## Archivos eliminados (18)

### Barrels muertos (6)
- `components/command-center/index.ts`
- `components/dashboard-md3/index.ts`
- `components/layout/index.ts`
- `components/chart/index.ts`
- `components/cds/index.ts`
- `components/rad/index.ts`

### Componentes / shims huérfanos (12)
- `ActivePatientBanner.tsx` — sustituido por `PatientIdentityBand` / contexto denso
- `actions/EpisClinicalActionBar.tsx` — shim; canon en `@epis2/epis2-ui`
- `interaction/EpisCopyPasteTextTools.tsx`, `EpisDraggableList.tsx` — re-export `@epis2/clinical-productivity`
- `chart/PatientChartBanner.tsx` — evolucionado a `PatientIdentityBand`
- `chart/TraditionalSectionMobileNav.tsx` — retirado de `TraditionalEhrMode` (ClassicChartTabs)
- `census/ShiftContextStrip.tsx` — fuera de búsqueda paciente
- `rad/EpisRadContextMenu.tsx`, `EpisRadFormSurface.tsx` — sin callers; RAD activo usa Screen/Grid/Document
- `layouts/ClinicalAppBarAlertsAction.tsx`, `ClinicalRoleCareContext.tsx`
- `status/EpisSystemStatus.ts`

## Ajustes colaterales

| Archivo | Cambio |
|---------|--------|
| `uiDensityRules.ts` | Canon `EpisClinicalFormActionBar`, `ClinicalCopyPasteTools`, `ClinicalDraggableList` |
| `web-components-root-frozen.mjs` | Retirado `ActivePatientBanner` de allowlist |
| Gates archivados | te-04, m3-scaffold, dual-chart-scaffold, rad-m3, classic-chart-composition |

## Baseline Knip

| MF | Unused files |
|----|-------------:|
| KNIP-01 | 38 |
| KNIP-02-A | 29 |
| **KNIP-02-B** | **11** (−18) |

Restantes (11): theme foundations epis2-ui, `apps/api/src/db.ts` (falso positivo), scripts/local-ai — candidatos KNIP-02-C+.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run quality:fast` | OK |

## Riesgos

- Ninguno en rutas CICA activas ni golden journey — verificado grep + vitest web.
- Superficies RAD productivas (`EpisRadScreenShell`, `EpisRadGridSurface`, `EpisRadDocumentSurface`) intactas.

## Próximo paso

**MF-KNIP-02-C** — `packages/epis2-ui/src/theme/foundations/**` + barrel `theme/index.ts`.
