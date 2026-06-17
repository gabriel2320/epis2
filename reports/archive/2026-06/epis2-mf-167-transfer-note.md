# MF-167 — Nota de traslado

**Estado:** DONE | **Ola:** 3 | **Fecha:** 2026-06-04

## Alcance
Blueprint `transfer_note`, intent `transfer_patient`, ruta `/espacio/traslado` y traslado de cama al aprobar borrador (API ingreso).

## Entregables
- `blueprints/transfer-note.ts` + `transfer-note.test.ts`
- `registry.ts`, `command-registry`, migración `028` (`transfer_note`)
- `clinical/service.ts` → `transferInpatientAdmission` en aprobación
- IA: `assistSchemas`, `draftPromptCatalog`, `assistBlueprintPattern`

## Gates
`npm run check`, `npm run test`, `npm run db:validate`; `assertRegistryInvariants` sin errores.

## Riesgos
Camas demo en seed; sin ingreso activo no debe escribir SoT.

## Próximo paso
MF-168 — `outpatient_visit`.
