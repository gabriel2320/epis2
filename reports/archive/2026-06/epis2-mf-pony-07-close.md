# MF-PONY-07 — Cierre (nav/tabs unificados)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM · **Pre-req:** MF-PONY-06

## Alcance

Un solo registro de tabs ficha (`clinicalChartTabRegistry`) con labels ES, rutas CICA y adapter legacy M3; sidebar L2 consume el mismo árbol.

## Cambios

| Acción | Detalle |
|--------|---------|
| SoT | `packages/epis2-ui/src/cica/clinicalChartTabRegistry.ts` |
| Legacy adapter | `LEGACY_PATIENT_CHART_TABS`, `resolveLegacyPatientChartTabId`, `legacyPatientChartTabTarget` |
| Sidebar | `cicaSidebarNav` usa `CICA_PATIENT_PRIMARY_NAV` / `CICA_PATIENT_MORE_NAV` del registro |
| Tabs UI | `CicaChartTabs` usa `buildCicaChartTabPath` + `chartTabLabelEs` |
| Web shim | `patientChartNavigation.ts` → re-export vía `@epis2/epis2-ui/clinical-chart-tabs` |
| Nav tree | `epis2NavigationTree.ts` import directo subpath (evita ciclo ESM con barrel) |
| Export | `@epis2/epis2-ui/clinical-chart-tabs` en package.json |
| Deprecación | `CICA_CHART_TAB_REGISTRY.ts` = re-export fino |

## Qué evitamos construir

- Tercera copia de labels/paths tabs (sidebar + tabs + legacy)
- Sync manual `patientChartNavigation` ↔ `CICA_CHART_TAB_REGISTRY`

## Gates

| Gate | Resultado |
|------|-----------|
| `validate-cica-screen-registry-gate` | OK |
| `validate-cica-clean-room-close-gate` | OK |
| `quality:fast` | OK |
| `clinicalChartTabRegistry.test.ts` | OK |
| `cicaSidebarNav.test.ts` | OK |
| `epis2NavigationTree.test.ts` | OK |

## Riesgos

- Subpath `@epis2/epis2-ui/clinical-chart-tabs` requiere `build -w @epis2/epis2-ui` antes de consumo desde dist en CI
- Legacy rail `/espacio/*` intacto — no eliminado en este MF (prohibido por plan)

## Próximo paso

**MF-PONY-08** — gate prune fase 2 · o commit PONY-06+07 en PR #46.
