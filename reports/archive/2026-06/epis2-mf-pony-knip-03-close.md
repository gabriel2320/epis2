# MF-KNIP-03 — Cierre (deps + duplicate exports)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Resolver hallazgos Knip post KNIP-02: unused dependencies, duplicate exports, aliases deprecated.

## Dependencies

| Paquete | Cambio |
|---------|--------|
| `@epis2/clinical-rules` | Retirado `@epis2/drug-dictionary-cl` (sin import en src) |
| `@epis2/epis2-ui` | Retirado `zod` (solo vía `@hookform/resolvers/zod`) |
| `@epis2/epis2-ui` | Retirado `@vitejs/plugin-react` (Storybook usa `@storybook/react-vite`) |

## Duplicate exports — consolidación

| Zona | Acción |
|------|--------|
| `clinicalChartTabRegistry.ts` | Eliminados alias `CICA_CHART_TAB_REGISTRY`, `findChartTabById` |
| `CICA_CHART_TAB_REGISTRY.ts` | **Eliminado** — imports → `clinicalChartTabRegistry.ts` |
| `island-layout.ts` | Un solo export `epis2ShellContentIslandSx` |
| `typography.ts` | Eliminado alias `epis2FontFamily` |
| `episModePreferences.ts` | Eliminados alias classic load/save |
| `invalidateClinical.ts` | Eliminado alias `invalidateAfterDraftApproval` |
| `design-agents/schemas.ts` | Dashboard* schemas → type aliases; agents usan schemas base |

## Gates actualizados

- `layout-g12-gate.mjs`, `validate-cica-screen-registry-gate.mjs`
- `validate-dashboard-design-agents-gate.mjs`, `validate-design-agent-schemas-gate.mjs`

## Knip post-MF

- **0** unused files
- **0** unused dependencies
- **0** duplicate exports
- Pendiente: unlisted deps (13) — fuera de alcance MF-KNIP-03

## Gates

| Gate | Resultado |
|------|-----------|
| `npx knip --reporter compact` | sin unused files/deps/duplicates |
| `architecture:validate` | OK |
| `typecheck @epis2/epis2-ui` + vitest | OK |
| `npm run quality:fast` | OK tras `build @epis2/lab-dictionary` (orden workspace) |

## Próximo paso

**MF-PONY-DOC-01** — docs typography paths · **MF-KNIP-04** (opcional) — unlisted deps en knip/package.json.
