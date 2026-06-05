# EPIS2-MUI-08 — Tree View

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

| Pieza | Función |
|-------|---------|
| `@mui/x-tree-view` | Dependencia solo en `@epis2/epis2-ui` (Community) |
| `EpisTreeView` | `SimpleTreeView` + estado vacío |
| `EpisTreeViewSuspense` | Lazy para navegación longitudinal |
| `buildDocumentTreeByType` | Jerarquía por `documentType` |
| `buildLongitudinalSectionTree` | Secciones clínicas + ítems |
| `LongitudinalNavTree` | Navegación en ficha longitudinal |
| `DocumentSearchPanel` | Resultados de búsqueda en árbol |

## Casos clínicos

1. Búsqueda documental agrupada por tipo.
2. Índice de documentos en longitudinal (árbol por tipo).
3. Navegación de secciones (problemas, alergias, timeline, etc.) con clic en borradores de timeline.

## Licencia

- **LIC-006** → `APPROVED` (Community).

## Próximo paso

**MUI-09:** completado — ver `reports/epis2-mui-09-dashboard-shell.md`.
