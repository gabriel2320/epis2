# Adaptación — CDR EPIONE + CDS EPIS

**Origen:** `migration/candidates/epione/epione-clinical-decision-rules/`

**Destino:** `packages/clinical-domain/src/clinicalDecisionRules/`

## Cambio de comportamiento

| EPIONE | EPIS2 |
|--------|-------|
| CDR `severity: block` en commit/sign | Advisory `SafetyWarning` critical |
| Contexto MAR/órdenes completas | Contexto desde resumen demo + `currentFields` del borrador |

## Fusión

`evaluateDemoClinicalAlerts()` = `evaluateClinicalSafety()` + `evaluateClinicalDecisionRules()` vía `buildCdrContextFromSafetyInput()`.

API `getDemoSafetyNotesForPatient` recibe `blueprintId` y `currentFields` desde `/api/ai/assist/draft`.
