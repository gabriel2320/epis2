# EPIS2-MUI-09 — Modo tablero (shell)

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

| Pieza | Función |
|-------|---------|
| `EpisDashboardShell` | Layout: título, badge demo, tabs, volver al comando |
| `EpisMetric` | KPI numéricos en tab Mi trabajo |
| `EpisTaskList` | Lista de sugerencias demo |
| `DashboardModeContent` | Lógica de tabs + grids/charts existentes |
| `DashboardModePage` | Lazy del chunk `dashboard/*` |
| Router | Lazy de `DashboardModePage` en `/epis2/dashboard` |

## Composición

- **Mi trabajo:** métricas + `WorklistDraftGrid` (lazy) + pacientes recientes + tareas.
- **Servicio / Paciente / Calidad:** tabs existentes con charts y grids MUI-05–07.

## Próximo paso

**MUI-11:** rendimiento, bundle y gates CI de licencias.
