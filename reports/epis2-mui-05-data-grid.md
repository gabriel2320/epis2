# EPIS2-MUI-05 — Data Grid (worklists)

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

| Pieza | Función |
|-------|---------|
| `@mui/x-data-grid` | Dependencia solo en `@epis2/epis2-ui` (Community) |
| `EpisDataGrid` | Wrapper denso, locale `esES`, estados error/vacío |
| `EpisDataGridSuspense` | Carga lazy opcional del grid |
| `DashboardWorklists` | Chunk lazy en tab «Mi trabajo» del tablero |
| `WorklistDraftGrid` | Columnas clínicas de borradores en `apps/web` |
| `MuiDataGrid` theme | Contenedor sin borde duplicado |

## Casos clínicos migrados

1. **Modo tablero → Mi trabajo:** `myOpenDrafts` y `pendingReview` (`DashboardModePage`).
2. **Tablero paciente:** `pendingDrafts` (`PatientDashboardTab`, columnas reducidas).

## Licencia

- **LIC-001** → `APPROVED` (Community). Sin row grouping Pro ni export Excel Premium.

## Validación

- `npm run build` / `npm test` / `architecture:validate` (sin `@mui/*` en `apps/web`).
- Catálogo `/dev/ui-catalog`: sección Data Grid (import síncrono para demo).

## Próximo paso

**MUI-06:** `@mui/x-date-pickers` + fechas en formularios clínicos.
