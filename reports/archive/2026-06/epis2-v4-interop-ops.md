# EPIS2 V4 — Interoperabilidad y operación (read-only)

**Fecha:** 2026-06-04  
**Commit:** `a02689d`  
**Tickets:** EPIS2-15, EPIS2-16 (slice cerrado)

## Alcance entregado

| Área | Detalle |
|------|---------|
| **BD** | `interop_staging_batches` (015) + seed HL7/FHIR demo (016) |
| **API** | Auditoría, ops, staging, validador HL7, tablero calidad |
| **Permisos** | `audit.read` (admin, auditor) |
| **FHIR** | Bundle con `AllergyIntolerance` y `MedicationStatement` |
| **UI** | Tab **Calidad** + validador HL7 demo |
| **Comando** | `tablero calidad` → `open_dashboard_quality` |

## Reglas de frontera

- Importación HL7/FHIR a SoT: **deshabilitada** (solo staging lectura).
- Export FHIR: habilitado con perfiles EPIS2.

## Verificación

```bash
npm run db:migrate   # 16 migraciones
npm test             # v4.integration.test.ts con DATABASE_URL
```

## Fuera de alcance (gate V4 completo)

- Writeback HL7/FHIR, administración de usuarios en UI, backups operativos

## Journey piloto

`golden-v4-interop-ops` — auditor.demo → tablero calidad → HL7 → bundle DEMO-005
