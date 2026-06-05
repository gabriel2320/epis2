# EPIS2 — Plan D slice: hospitalización operativa

**Fecha:** 2026-06-05  
**Estado:** slice cerrado (demo)

## Entregables

| # | Entregable | Estado |
|---|------------|--------|
| D1 | Ingreso hospitalario API + UI tablero servicio | ✓ |
| D2 | Traslado de cama API + UI | ✓ |
| D3 | Preparación alta + enlace epicrisis | ✓ |
| D4 | Alta operativa E2E + journey V2 CI | ✓ |
| D5 | Clinical actions EPIONE | — (opcional, fuera de slice) |

## API

- `POST /api/inpatient/admissions`
- `POST /api/inpatient/admissions/:id/transfer`
- `POST /api/inpatient/admissions/:id/discharge`

## Comando

- `ingreso hospitalario` → Modo tablero / pestaña servicio (`admit_patient_hospital`)

## UI

- `ServiceDashboardTab`: admitir, trasladar, preparar epicrisis, alta operativa

## Gates

Ejecutar con `DATABASE_URL` + `npm run db:migrate`.

## Próximo

**Plan E** — enfermería/farmacia tableros por rol.
