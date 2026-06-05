# EPIS2-MUI-05 — Data Grid (worklists)

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

| Pieza | Función |
|-------|---------|
| `@mui/x-data-grid` | Dependencia solo en `@epis2/epis2-ui` (Community) |
| `EpisDataGrid` | Wrapper denso, locale `esES`, estados error/vacío |
| `EpisDataGridSuspense` | Carga lazy opcional del grid |
| `DashboardWorklists` | Chunk lazy en tab «Mi trabajo» del tablero |
| `WorklistDraftGrid` | Borradores en tablero trabajo/paciente |
| `PatientListGrid` | Búsqueda y ficha sin paciente |
| `LabObservationsGrid` | Resultados lab demo (longitudinal + tab paciente) |
| `QualityDashboardGrids` | Staging + auditoría (solo lectura) |

## Casos clínicos migrados

1. Modo tablero → Mi trabajo (`myOpenDrafts`, `pendingReview`).
2. Tablero paciente → `pendingDrafts` y `recentObservations`.
3. Lista pacientes → búsqueda (`GeneratedClinicalFormPage`) y ficha (`PatientWorkspacePage`).
4. Laboratorio demo → observaciones en `PatientLongitudinalPanel`.
5. Calidad → `QualityDashboardTab` (staging + auditoría).

## Licencia

- **LIC-001** → `APPROVED` (Community).

## Próximo paso

**MUI-06:** `@mui/x-date-pickers` — ver `reports/epis2-mui-06-date-pickers.md`.
