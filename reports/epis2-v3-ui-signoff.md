# EPIS2-V3 — UI signoff (enfermería y farmacia)

**Fecha:** 2026-06-05 · **Alcance:** Cerrar gate V3 EPIS2-14 — tableros por rol y MAR programado UI

## Contexto

Plan E (API) ya entregó tableros nursing/pharmacy, MAR programado (migración 021) y journey `golden-v3-mar-nursing` en CI (`7fb6795`). Esta sesión cierra la **cobertura UI** y el signoff formal del gate V3 demo.

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `NursingDashboardTab` — MAR ventana activa + borradores | ✓ (base Plan E) |
| 2 | `PharmacyDashboardTab` — validaciones + conciliación CDR | ✓ (base Plan E) |
| 3 | Deep-link `?tab=nursing` / `?tab=pharmacy` en router | ✓ |
| 4 | Test UI enfermería (MAR, doble chequeo, borrador) | ✓ |
| 5 | Test UI farmacia (validación, conciliación) | ✓ |
| 6 | Copy español botones farmacia (`reviewValidation`, `validateReconciliation`) | ✓ |

## Comandos demo

| Comando | Destino |
|---------|---------|
| `nota de enfermeria` | `/espacio/enfermeria` |
| `registrar mar` | `/espacio/mar` |
| `validacion farmaceutica` | `/espacio/farmacia` |

## Usuarios demo

| Usuario | Tab visible |
|---------|-------------|
| `enfermeria.demo` | Enfermería |
| `farmacia.demo` | Farmacia |
| `medico.demo` | Enfermería + Farmacia |

## Gates API (ya existentes)

- `golden-v3-mar-nursing` en `golden-clinical-journey.api.spec.ts`
- `v3-mar.integration.test.ts`, `dashboard.test.ts` (rol)

## Gates sesión

- `npm run check` — OK (lint + typecheck + architecture:validate)
- `npm run test` — OK (295 passed, 20 skipped)
- `npm run db:validate` — OK

## Fuera de alcance (producto real)

- Balance hídrico, signos estructurados, MAR fuera de ventana demo
- Conciliación con motor CDS completo EPIONE

## Próximo paso

**Plan F** — V4 interop read-only + hardening piloto, o **CI bundle** (`qa:bundle-analyze`).
