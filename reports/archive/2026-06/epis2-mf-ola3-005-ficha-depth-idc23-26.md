# MF-OLA3-005 — Ficha profundidad longitudinal (IDC 23–26)

**Fecha:** 2026-06-07  
**Ola:** 3  
**Estado:** ✅ Cerrada

## Alcance

Timeline, medicamentos activos, grid de observaciones y curvas clínicas en ficha paciente.

## Cambios

- `PatientLongitudinalPanel` — testids timeline/medications/observations
- `PatientLongitudinalPanel.test` — datos demo sintéticos
- `e2e/ola3-ficha-journey.spec.ts` — DEMO-001 timeline/meds; DEMO-005 charts
- `validate-ola3-ficha-depth-gate.mjs`

## Evidencia

| Gate | Resultado |
|------|-----------|
| ola3-ficha-depth-gate | ✅ |
| test:e2e:ola3 (6 tests) | ver CI |

## IDC

23, 24, 25, 26 → **Done**

## Próximo paso

IDC 30 antecedentes quirúrgicos; IDC 21 ficha hub promover tras journey estable.
