# MF-180 — HL7 inbound en cuarentena

## Alcance
Intake HL7 sin escritura SoT — tabla `interop_hl7_quarantine` + POST `/api/interop/hl7/quarantine`.

## Entregables
- Migración `031_hl7_quarantine.sql`
- API cuarentena + auditoría `interop.hl7.quarantined`
- UI botón «Cuarentena HL7» en tab Calidad

## Gates
- `hl7.integration.test.ts` intake ✓
- Sin INSERT en `clinical_notes` en cuarentena ✓

## Riesgos
Mensajes malformados rechazados en 400 — no entran a cuarentena.

## Próximo paso
MF-181 mapeo.
