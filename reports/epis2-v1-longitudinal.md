# EPIS2 V1 — Ficha longitudinal (slice demo)

**Estado:** implementado en código local (migraciones 008/009, API, UI ficha + tablero paciente).  
**Gate:** sin RAG, OCR, PDF ni blueprints hospitalarios nuevos.

## Entregables

| Área | Detalle |
|------|---------|
| **BD** | `patient_allergies`, `patient_medications`, `clinical_documents` + seed 5 casos (penicilina DEMO-005) |
| **API** | `GET /api/patients/:id/longitudinal`, `GET /api/dashboard/patient/:id` |
| **UI** | `PatientLongitudinalPanel` en ficha; tab Paciente en tablero con `PatientDashboardTab` |
| **CDR** | Alergias DB fusionadas en alertas demo (`getDemoClinicalAlertsForPatient`) |
| **Navegación** | `patientId` en search de `/epis2/dashboard`; comando/tablero con paciente activo |

## Verificación

```bash
npm run db:migrate
npm test
# Con PostgreSQL:
DATABASE_URL=... npm test  # incluye integración longitudinal DEMO-005
```

## Fuera de alcance (V1 posterior / V2+)

- Interconsulta / imagenología blueprints
- RAG pgvector, impresión PDF, FHIR ampliado
- Tablero de servicio (V2)

## Siguiente

- Commit `feat(v1): ficha longitudinal demo`
- Cerrar checklist gate V1 en [EPIS2_RELEASE_ROADMAP.md](../docs/product/EPIS2_RELEASE_ROADMAP.md) tras piloto humano
