# EPIS2-MUI-07 — Charts

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

| Pieza | Función |
|-------|---------|
| `@mui/x-charts` | Dependencia solo en `@epis2/epis2-ui` (Community) |
| `EpisTrendChart` | Línea o barras, altura fija, estado vacío |
| `EpisTrendChartSuspense` | Lazy en tablero servicio |
| `PatientClinicalCharts` | INR + FC en ficha longitudinal (DEMO-005) |
| `ServiceDashboardCharts` | KPI bar chart en tab Servicio |
| Migración `018` | Puntos temporales demo INR/FC para DEMO-005 |

## Casos clínicos

1. Tendencia labs DEMO-005 (`PatientLongitudinalPanel`).
2. Signos vitales serie temporal (FC).
3. KPI servicio (`ServiceDashboardTab`).

## Licencia

- **LIC-005** → `APPROVED` (Community).

## Próximo paso

**MUI-08:** `@mui/x-tree-view` + jerarquía documental.
