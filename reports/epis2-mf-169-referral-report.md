# MF-169 — Informe de interconsulta

**Estado:** DONE | **Ola:** 3 | **Fecha:** 2026-06-04

## Alcance
Informe de respuesta a interconsulta, separado del borrador de solicitud (`referral`).

## Entregables
- `blueprints/referral-report.ts`, intent `respond_referral`
- `registry.ts`, tipo `referral_report` en migración `028`
- Validación en `validate.ts` (contrato MF-156)

## Gates
`npm run check`, `npm run test`, `architecture:validate` (registry único).

## Riesgos
Enlace solicitud↔informe por contexto de paciente hasta trazabilidad dedicada.

## Próximo paso
MF-170 — registry 18 blueprints + scaffold.
