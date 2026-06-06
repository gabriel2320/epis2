# MF-OLA2-002 — Snapshots regresión visual Ola 2

**Fecha:** 2026-06-07  
**Ola:** 2  
**Estado:** ✅ Cerrada (E2E + snapshots)

## Alcance

Regresión visual M3-0.12: comando, ambulatorio scrollspy, certificado, journey borrador.

## Cambios

- `e2e/helpers/demoPatient.ts` — login estable, pin demo, `openAmbulatoryFromCommand`
- `e2e/ola2-ambulatory-m3-ui.spec.ts` — navegación vía comando (evita race sesión)
- Snapshots:
  - `e2e/ola2-ambulatory-m3-ui.spec.ts-snapshots/ola2-comando-chromium-win32.png`
  - `ola2-outpatient-visit-chromium-win32.png`
  - `ola2-medical-certificate-chromium-win32.png`
- `apps/api/src/auth/routes.ts` — sin rate-limit login en `development` (E2E repetibles)

## Evidencia

| Gate | Resultado |
|------|-----------|
| test:e2e:ola2 | ✅ 4 tests |
| quality:ola2-m3-ui-gate | ✅ |

## Pendiente

- IDC 40 sigue **Active** (print A5 productivo)
