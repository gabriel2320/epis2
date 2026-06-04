# EPIS2 — Perfil mínimo de exportación FHIR R4

**Fase:** EPIS2-10 · **Import:** diferido en v1

FHIR es **frontera de interoperabilidad**, no modelo de UI ni runtime principal.

---

## Recursos exportados

| Recurso | Origen SoT PostgreSQL | Endpoint |
|---------|----------------------|----------|
| Patient | `patients` + `patient_identifiers` | `GET /api/fhir/Patient/:patientId` |
| Encounter | `encounters` | `GET /api/fhir/Encounter/:encounterId` |
| DocumentReference | `clinical_notes` (aprobadas) | `GET /api/fhir/DocumentReference/:noteId` |
| ServiceRequest | `clinical_drafts` con `draft_type = lab_request` | `GET /api/fhir/ServiceRequest/:draftId` |
| Bundle | Agregado por paciente | `GET /api/fhir/patients/:patientId/bundle` |

Permiso requerido: `fhir.export`.

Content-Type de respuesta: `application/fhir+json`.

---

## Perfiles StructureDefinition (laboratorio)

Base: `http://epis2.local/fhir`

| Perfil | URL |
|--------|-----|
| Patient mínimo | `.../StructureDefinition/epis2-patient-minimal` |
| Encounter mínimo | `.../StructureDefinition/epis2-encounter-minimal` |
| DocumentReference mínimo | `.../StructureDefinition/epis2-document-reference-minimal` |
| ServiceRequest mínimo | `.../StructureDefinition/epis2-service-request-minimal` |
| Bundle export | `.../StructureDefinition/epis2-patient-export-bundle` |

Validación en CI: esquemas Zod en `@epis2/fhir-export` + `assertExportClean`.

---

## Reglas de mapeo

1. **Datos sintéticos:** `meta.tag` con `code: synthetic` y display `DEMO/SINTÉTICO` cuando `is_synthetic = true`.
2. **Identificador demo:** `identifier.system` = `http://epis2.local/fhir/NamingSystem/demo`, valor `DEMO-00x`.
3. **Notas / borradores:** el cuerpo JSON interno se serializa a narrativa `text/plain` base64 en `DocumentReference.content` — **no** se copian claves de formulario (`activeProblems`, `blueprintId`, etc.).
4. **ServiceRequest:** solo desde borradores de laboratorio; prioridad `rutina` → `routine`, `urgente` → `urgent`.

---

## Prohibido en v1

- Importación FHIR (`POST /api/fhir/*`, merge en SoT).
- Campos solo-UI en recursos exportados (gate `assertExportClean`).
- Dependencia de OpenMRS / Medplum en runtime.

---

## Implementación

Paquete: `packages/fhir-export`  
API: `apps/api/src/fhir/`
