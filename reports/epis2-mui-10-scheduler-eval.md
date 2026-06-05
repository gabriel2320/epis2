# EPIS2-MUI-10 — Scheduler (evaluación)

**Fecha:** 2026-06-04 · **Estado:** spike completado · **Licencia:** LIC-007 `EVALUATE`

## Entregado

| Pieza | Función |
|-------|---------|
| `@mui/x-scheduler@9.0.0-alpha.4` | Dependencia en `epis2-ui` (Community MIT) |
| `EpisEventCalendarSpike` | Wrapper `EventCalendar` + locale `esES` + citas demo |
| `@epis2/epis2-ui/scheduler` | Subpath aislado (no re-export en barrel principal) |
| `/dev/scheduler-spike` | Ruta aislada (dev o `VITE_ENABLE_SCHEDULER_SPIKE=true`) |
| Lazy | Ruta y calendario con `React.lazy` + `Suspense` |

## Hallazgos

1. **Peer deps:** Scheduler v9 alpha exige `@mui/material` ^7.3; EPIS2 usa MUI 6.4 — instalación con `--legacy-peer-deps`; alinear majors antes de producción.
2. **Madurez:** API alpha; MUI estima estable ~julio 2026.
3. **Tier:** Community cubre calendario semanal/día/agenda con recursos y drag; Premium = recurrencia, timeline denso, lazy load.
4. **Dominio:** No hay modelo `Appointment` ni API de slots — **no integrar** en menú clínico hasta producto + LIC-007 `APPROVED`.

## Alternativa si se rechaza licencia / spike

Vista lista de citas + `EpisDatePicker` (ver `MUI_LICENSING_DECISION_LOG.md`).

## Próximo paso

**MUI-11:** bundle audit, ESLint `no-restricted-imports`, lazy routes consolidado, CI licencias.
