# EPIS2 V3 — Enfermería y farmacia (slice demo)

**Ticket:** EPIS2-14 (slice cerrado)  
**Commit:** `be5eb59`

## Entregables

| Área | Detalle |
|------|---------|
| **Blueprints** | Nota enfermería, MAR, validación farmacéutica |
| **Intents** | `create_nursing_note`, `record_medication_administration`, `prepare_pharmacy_review` |
| **BD** | `mar_administration_records` (014); `draft_type` V3 (017) |
| **Rutas** | `/espacio/enfermeria`, `/espacio/mar`, `/espacio/farmacia` |
| **Tablero** | Tareas demo MAR/farmacia en «Mi trabajo» |

## Gate V3 (slice)

Aprobar borrador MAR con doble chequeo → fila en `mar_administration_records` + nota clínica.

Integración: `v3-mar.integration.test.ts`

## Fuera de alcance (gate V3 completo)

- Tableros dedicados enfermería/farmacia por rol
- Conciliación completa, MAR programado, balance hídrico

## Journey

`golden-v3-mar-nursing` en [EPIS2_GOLDEN_JOURNEYS.md](../docs/quality/EPIS2_GOLDEN_JOURNEYS.md)
