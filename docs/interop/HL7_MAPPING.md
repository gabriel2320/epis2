# HL7 v2 — Mapeo demo EPIS2 (MF-181)

| HL7 | Draft EPIS2 | Campos |
|-----|-------------|--------|
| ORU^R01 | `lab_request` | labTests, clinicalReason, priority |
| ADT^A01 | `admission_note` | admissionReason, clinicalSummary, initialPlan |
| Otros | `evolution_note` | subjective, objective, assessment, plan |

**Reglas:** cuarentena primero; mapeo preview; writeback solo propone borrador; humano aprueba en flujo clínico estándar.
