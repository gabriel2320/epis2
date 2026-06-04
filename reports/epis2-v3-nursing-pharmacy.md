# EPIS2 V3 — Enfermería y farmacia (slice demo)

**Ticket:** EPIS2-14 (parcial).

## Entregables

| Área | Detalle |
|------|---------|
| **Blueprints** | Nota enfermería, MAR (`medication_administration`), validación farmacéutica |
| **Intents** | `create_nursing_note`, `record_medication_administration`, `prepare_pharmacy_review` |
| **BD** | `mar_administration_records` al aprobar borrador MAR |
| **Rutas** | `/espacio/enfermeria`, `/espacio/mar`, `/espacio/farmacia` |

## Gate V3 (parcial)

Aprobar borrador MAR con doble chequeo documentado → registro en `mar_administration_records` + nota clínica (sin auto-dispensación).

## Pendiente

- Tableros rol enfermería/farmacia dedicados; conciliación completa; MAR programado.
