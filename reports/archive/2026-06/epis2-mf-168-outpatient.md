# MF-168 — Consulta ambulatoria

**Estado:** DONE | **Ola:** 3 | **Fecha:** 2026-06-04

## Alcance
Consulta ambulatoria como borrador clínico; aprobación humana obligatoria.

## Entregables
- `blueprints/outpatient-visit.ts`, intent `create_outpatient_visit`
- Enlace en `registry.ts`; `outpatient_visit` en migración `028`
- Patrón IA MF-188 para borradores

## Gates
`npm run check`, tests de blueprint, paridad intent ↔ registry.

## Riesgos
Cadena Golden Journey ambulatoria aún parcial; borrador ≠ SoT.

## Próximo paso
MF-169 — `referral_report` / `respond_referral`.
