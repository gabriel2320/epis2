# EPIS2 V4 — Interoperabilidad y operación (read-only)

**Fecha:** 2026-06-04  
**Tickets:** EPIS2-15, EPIS2-16

## Alcance entregado

| Área | Detalle |
|------|---------|
| **BD** | `interop_staging_batches` (015) + seed HL7/FHIR demo (016) |
| **API** | `GET /api/audit/events`, `GET /api/ops/status`, `GET /api/interop/staging`, `POST /api/interop/hl7/validate`, `GET /api/dashboard/quality` |
| **Permisos** | `audit.read` (admin, auditor) |
| **FHIR** | Bundle paciente incluye `AllergyIntolerance` y `MedicationStatement` desde longitudinal |
| **UI** | Tab **Calidad** en `/epis2/dashboard?tab=quality` + validador HL7 demo |
| **Comando** | `tablero calidad` → `open_dashboard_quality` |

## Reglas de frontera

- Importación HL7/FHIR a SoT: **deshabilitada** (solo staging lectura).
- Export FHIR: habilitado con perfiles EPIS2 y validación sin claves UI.

## Verificación

```bash
npm run db:migrate
npm test
```

Integración V4 (`DATABASE_URL`): `apps/api/src/v4/v4.integration.test.ts`

## Journey piloto V4

1. Login `auditor.demo` / `DEMO-CLAVE-AUDITOR`
2. Comando: `tablero de calidad`
3. Revisar lotes staging, auditoría reciente, métricas ops
4. Validar mensaje HL7 demo en panel
5. (Opcional médico) Export bundle `DEMO-005` — alergia penicilina en FHIR
