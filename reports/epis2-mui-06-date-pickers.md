# EPIS2-MUI-06 — Date Pickers

**Fecha:** 2026-06-04 · **Estado:** completado

## Entregado

| Pieza | Función |
|-------|---------|
| `@mui/x-date-pickers` + `dayjs` | Solo en `@epis2/epis2-ui` |
| `Epis2ThemeProvider` | `LocalizationProvider` + `AdapterDayjs` + locale `es` |
| `EpisDatePicker` | Selector de fecha (valor `YYYY-MM-DD`) |
| `EpisClinicalField` | Tipo `date` usa `EpisDatePicker` |

## Formularios

| Blueprint | Campo fecha |
|-----------|-------------|
| `evolution_note` | `encounterDate` — encuentro |
| `lab_request` | `scheduledDate` — programación orden |
| `imaging_request` | `scheduledDate` — programación estudio |

Valores iniciales de fecha: día actual (ISO) en `initialFormValues`.

## Licencia

- **LIC-004** → `APPROVED` (Community). Sin `DateRangePicker` Pro en V1.

## Próximo paso

**MUI-07:** `@mui/x-charts` + tendencias demo.
