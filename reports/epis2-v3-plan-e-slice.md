# EPIS2 — Plan E: V3 enfermería y farmacia

**Fecha:** 2026-06-05  
**Estado:** slice cerrado (demo)

## Entregables

| # | Entregable | Estado |
|---|------------|--------|
| E1 | Tablero enfermería (`GET /api/dashboard/nursing`) + UI tab | ✓ |
| E2 | Tablero farmacia (`GET /api/dashboard/pharmacy`) + UI tab | ✓ |
| E3 | MAR programado (`mar_scheduled_doses`, migración 021) | ✓ |
| E4 | Conciliación medicamentosa CDR (`medication_reconciliation_gap`) | ✓ |
| E5 | IA assist nursing/MAR/farmacia en `assistSchemas` | ✓ |
| Gate V3 | `golden-v3-mar-nursing` en CI | ✓ |

## API

- `GET /api/dashboard/nursing` — rol nurse/physician/admin
- `GET /api/dashboard/pharmacy` — rol pharmacist/physician/admin
- `GET /api/dashboard/work` — filtra borradores y tareas demo por rol

## BD

- `database/migrations/021_v3_mar_schedule.sql` — ventanas horarias demo DEMO-004/005

## UI

- `NursingDashboardTab` — MAR programado + borradores enfermería
- `PharmacyDashboardTab` — validaciones pendientes + conciliación
- `DashboardModeContent` — tabs por rol (`nursing` / `pharmacy`)

## Tests

- `dashboard.test.ts` — auth + tableros rol
- `v3-mar.integration.test.ts` — ventana MAR activa
- `rules.test.ts` — conciliación
- `migration-v3-mar-schedule.test.mjs`
- `golden-clinical-journey.api.spec.ts` — `golden-v3-mar-nursing`

## Demo

| Usuario | Clave | Tab |
|---------|-------|-----|
| `enfermeria.demo` | `DEMO-CLAVE-ENFERMERIA` | Enfermería |
| `farmacia.demo` | `DEMO-CLAVE-FARMACIA` | Farmacia |

## Riesgos

- Aprobación MAR requiere `draft.approve` (médico/farmacéutico); enfermería solo crea borrador.
- Seed MAR usa ventanas relativas a `NOW()` — CI debe ejecutar tras migración.

## Próximo

**Plan F** — V4 interop read-only + V5 IA trazable + hardening piloto.
