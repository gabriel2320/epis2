# Adaptación — golden FHIR EPIDOS → EPIS2

**Origen conceptual:** `Epidos/packages/connectors/src/fhir/golden/validate-export-bundle.ts`

**Destino:**

- `packages/fhir-export/src/validateExportBundle.ts`
- `packages/fhir-export/fixtures/golden/demo-001-patient.bundle.json`
- `packages/fhir-export/src/golden-bundles.test.ts`

## Diferencias de perfil

| EPIDOS | EPIS2 |
|--------|-------|
| Bundle `type: document` | `type: collection` |
| Tag perfil EPIDOS-Export | `meta.profile` EPIS2 bundle |
| Practitioner en bundle | No incluido en MVP |

## Qué valida

- Primer recurso `Patient`
- Tipos permitidos: Patient, Encounter, DocumentReference, ServiceRequest
- Referencias internas sin dangling
- Sin sistemas LOINC/SNOMED inventados en export demo
