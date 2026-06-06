# EPIS2-V2 — UI signoff (hospitalización operativa E2E)

**Fecha:** 2026-06-05 · **Alcance:** Cerrar gate V2 EPIS2-13 — superficie web ingreso/traslado/alta

## Contexto

Plan D (API) ya entregó admisiones, traslados, alta operativa y journey `golden-v2-admission-discharge` en CI (`bfbe52c`). Esta sesión cierra la **cobertura UI** y el signoff formal del gate V2 demo.

## Entregables

| # | Cambio | Estado |
|---|--------|--------|
| 1 | `ServiceDashboardTab` — ingreso, traslado, alta, acuse crítico | ✓ (base Plan D) |
| 2 | Test UI flujo E2E ingreso → traslado → alta + epicrisis | ✓ |
| 3 | Test UI acuse resultado crítico | ✓ |
| 4 | `data-testid` admit/transfer/discharge para journey UI | ✓ |
| 5 | Copy de error unificado (`copy.errors.genericMessage`) | ✓ |

## Comando

- `ingreso hospitalario` → Modo tablero / pestaña **Servicio** (`admit_patient_hospital`)
- `ver el servicio` → tablero censo + órdenes + críticos

## Gates API (ya existentes)

- `golden-v2-admission-discharge` en `golden-clinical-journey.api.spec.ts`
- `inpatient.integration.test.ts` (traslado, ingreso, alta, acuse)

## Gates sesión

- `npm run check` — OK (lint + typecheck + architecture:validate)
- `npm run test` — OK (291 passed, 20 skipped)
- `npm run db:validate` — OK

## Fuera de alcance (producto real)

- Clinical Action Engine EPIONE (`packages/clinical-actions`)
- Rondas clínicas programadas, entrega de turno enfermería

## Próximo paso

**Plan E / EPIS2-14** — tableros enfermería/farmacia por rol y MAR programado UI.
