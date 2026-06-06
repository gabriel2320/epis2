# MF-182 — Writeback HL7 controlado

## Alcance
Propuesta de borrador clínico desde cuarentena; aprobación humana obligatoria; revert auditado.

## Entregables
- POST `.../propose-writeback` → `clinical_drafts` status `draft`
- POST `.../revert` → cancela borrador + status `reverted`
- Auditoría: `interop.hl7.writeback_proposed`, `interop.hl7.reverted`

## Invariantes
- IA no aprueba; writeback no crea nota aprobada
- Revertible sin commit SoT clínico final

## Gates
- `hl7.integration.test.ts` ciclo completo ✓

## Próximo paso
Programa post-MVP MF-151…182 cerrado — siguiente fase institucional fuera de ledger.
