# MF-181 — Mapeo HL7

## Alcance
Preview de campos internos desde ORU^R01 y ADT^A01 sin persistir SoT.

## Entregables
- `apps/api/src/interop/hl7Mapping.ts`
- `docs/interop/HL7_MAPPING.md`
- GET `/api/interop/hl7/quarantine/:id/mapping`

## Gates
- `hl7Mapping.test.ts` ✓
- Integración mapping en journey HL7 ✓

## Próximo paso
MF-182 writeback auditado.
