# EPIS2 - Cierre sesion 2026-06-19

## Gates

- [x] check (lint+types+arch) (ok)
- [ ] test (fail)
- [x] db:validate (ok)
- [x] quality:fast (ok)
- [x] targeted vitest classic/dashboard/density (ok)

## Alcance

MF-KNIP-05-C / poda segura de codigo muerto legado.

- `apps/web/src/components/actions/EpisBulkActionMenu.tsx`: retiro de wrapper deprecado sin callers (`EpisProgressiveMenu`).
- `apps/web/src/components/grids/radBulkActions.ts`: retiro de helpers RAD sin callers (`copySelectionBulkAction`, `markReviewedBulkAction`).
- `apps/web/src/components/dashboard-md3/EpisDashboardMd3MainGrid.tsx`: retiro de empty-state exportado sin callers.
- `apps/web/src/components/classic-md3/EpisClassicMd3SplitPane.tsx`: eliminacion de componente legacy sin callers reales.
- `apps/web/src/components/classic-md3/index.ts`: retiro del re-export del split pane eliminado.
- `apps/web/src/quality/uiDensityRules.ts`: retiro de referencia nominal al wrapper eliminado.

## Decisiones

- No tocar `apps/web/src/lab/design-agents/schemas.ts`: Knip lo marca como unused export, pero gates historicos validan nombres de schemas por string.
- No tocar contracts, registries, auth, DB ni rutas `/espacio/*`.
- Mantener lote pequeno y reversible: Knip bajo de 115 a 111 unused exports y de 68 a 67 unused exported types.

## Riesgos

- `npm run test` falla en suite completo por pruebas no relacionadas con este diff (`ResultsInboxPage`, `GeneratedClinicalFormPage`, `apps/api/src/otel.test.ts`).
- `npm run knip:audit -- --reporter compact` sigue saliendo non-zero por deuda baseline: 111 unused exports, 67 unused exported types y `iexpress.exe` como binary no listado.

## Proximo paso exacto

- Siguiente lote safe: barriles legacy (`apps/web/src/modes/index.ts`, `apps/web/src/components/classic-md3/index.ts`) o types internos no publicos, manteniendo lotes <=10 y gates por zona.
- Antes de commit: decidir si se corrige/aisla la deuda del suite completo o se acepta como falla baseline documentada.

**Atencion:** 1 gate opcional fallo en suite completo; no corregido en esta MF para no mezclar deuda ajena con poda de codigo muerto.
