# MF-OLA3-003 — Banner alertas ficha (IDC 22)

**Fecha:** 2026-06-07  
**Ola:** 3  
**Estado:** ✅ Cerrada

## Alcance

Banner de alertas clínicas visible en ficha longitudinal (DEMO-005) con gate estático y E2E.

## Cambios

- `ClinicalAlertsPanel` ya integrado en `PatientWorkspacePage`
- `e2e/ola3-ficha-journey.spec.ts` — test DEMO-005 + `epis2-clinical-alerts`
- `scripts/quality/validate-ola3-alerts-gate.mjs`
- `package.json` — `quality:ola3-alerts-gate`
- Matriz IDC **22 → Done**

## Evidencia

| Gate | Resultado |
|------|-----------|
| ClinicalAlertsPanel.test | ✅ |
| PatientWorkspacePage.test | ✅ |
| ola3-alerts-gate | ✅ |
| test:e2e:ola3 (4 tests) | ver CI / ejecución local |

## Riesgos

- DEMO-005 debe estar cargado en sesión demo; helper `pinDemoCase` mitiga race de auth.

## Próximo paso

Promover IDC 27–29 tras E2E ficha estable en CI.
