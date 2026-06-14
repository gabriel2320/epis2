# MF-IC-02 — SNRE staging MedicationRequest

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-STRENGTHEN · **Subprograma:** PROG-INTEROP-CHILE fase 2  
**Gate:** `npm run test -- packages/fhir-export` ✓

---

## Alcance

Borrador `prescription` → JSON staging MedicationRequest con perfil SNRE demo (`snre-medication-request-staging`). Envelope `{ staging: true, noRealSend: true, medicationRequest }`. Sin envío SNRE real.

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `packages/fhir-export/src/snreStaging.ts` | `toSnreStagingMedicationRequest`, `buildSnreStagingJson`, validador |
| `packages/fhir-export/src/snreStaging.test.ts` | Round-trip DEMO-001/005 · schema · tags staging |

## Gates

```bash
npm run test -- packages/fhir-export
```

## Próximo paso

**MF-IC-03** — Questionnaire export piloto (BLOCKED).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
