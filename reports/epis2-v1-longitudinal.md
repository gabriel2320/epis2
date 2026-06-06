# EPIS2 V1 — Ficha longitudinal (slice demo)

**Estado:** gate V1 demo cerrado — API Plan C + UI export/OCR (2026-06-05)  
**Ver también:** `reports/epis2-v1-plan-c-complete.md`, `reports/epis2-v1-ui-signoff.md`

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

## Fuera de alcance (producto real)

- OCR productivo (Tesseract/sidecar), PDF con librería externa
- Tablero de servicio completo (V2 gate)

## Journey

`golden-v1-longitudinal-review` en [EPIS2_GOLDEN_JOURNEYS.md](../docs/quality/EPIS2_GOLDEN_JOURNEYS.md)
