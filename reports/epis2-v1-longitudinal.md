# EPIS2 V1 — Ficha longitudinal (slice demo)

**Estado:** cerrado (slice demo) — commits `117cbeb`, `7ac8007`  
**Gate completo V1:** pendiente RAG, OCR, PDF (EPIS2-11+).

## Entregables

| Área | Detalle |
|------|---------|
| **BD** | `patient_allergies`, `patient_medications`, `clinical_documents` + seed (penicilina DEMO-005) |
| **API** | `GET /api/patients/:id/longitudinal`, `GET /api/dashboard/patient/:id`, `GET .../documents/search` |
| **UI** | `PatientLongitudinalPanel`, tab Paciente en tablero, `DocumentSearchPanel` |
| **Blueprints** | Interconsulta, imagenología (`7ac8007`) |
| **CDR** | Alergias DB en alertas demo |
| **FHIR** | Bundle con alergias/meds (`V4`) |

## Verificación

```bash
npm run db:migrate
npm test
```

Integración: `clinical.integration.test.ts` (longitudinal DEMO-005, búsqueda docs, comandos interconsulta/imagenología).

## Fuera de alcance (gate V1 completo)

- RAG pgvector, OCR, impresión PDF masiva
- Tablero de servicio (V2)

## Journey

`golden-v1-longitudinal-review` en [EPIS2_GOLDEN_JOURNEYS.md](../docs/quality/EPIS2_GOLDEN_JOURNEYS.md)
