# MF-IC-01 — Perfil export MINSAL (Patient/Encounter/DocumentReference)

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-STRENGTHEN · **Subprograma:** PROG-INTEROP-CHILE fase 1  
**Gate:** `npm run test -- packages/fhir-export` ✓ (17/17)

---

## Alcance

Export FHIR Chile MINSAL (subset demo): Patient con identifier RUN + coding CSTipoIdentificador, Encounter y DocumentReference con perfiles `http://epis2.cl/fhir/StructureDefinition/minsal-*`. Sin servidor FHIR externo ni envío MINSAL real.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `packages/clinical-domain/src/chile/minsalProfiles.ts` | Perfiles MINSAL, `buildMinsalIdentifierCoding`, `mapPatientIdentifierToFhir` |
| `packages/fhir-export/src/minsalExport.ts` | `toMinsalFhir*` + `buildMinsalExportBundle` + validadores |
| `packages/fhir-export/src/minsalExport.test.ts` | Round-trip DEMO-001/005 · bundle MINSAL profiles |
| `validateExport.ts` | `assertExportClean` acepta perfiles MINSAL |

## RUT demo

- DEMO-001: `12.345.678-5`
- DEMO-005: `9.876.543-3`

## Gates

```bash
npm run quality:interop-chile-gate
npm run test -- packages/fhir-export
```

## Próximo paso

**MF-IC-02** — SNRE staging MedicationRequest (BLOCKED).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
