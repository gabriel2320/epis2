# EPIS2 V2 — Hospitalización operativa (slice demo)

**Ticket:** EPIS2-13 (slice cerrado)  
**Commits:** `aaa6e7d`, `8470f38`  
**Gate completo V2:** pendiente traslados, alta operativa end-to-end.

## Entregables

| Área | Detalle |
|------|---------|
| **BD** | Unidades, camas, admisiones, críticos; `clinical_orders` (012/013) |
| **Seed** | `CIRUGIA-DEMO`; DEMO-004/005 en 101A/101B; INR sin acuse |
| **API** | Tablero servicio, acuse crítico, órdenes activas en agregado |
| **UI** | Tab **Servicio** (`ServiceDashboardTab` + lista órdenes) |
| **Comando** | `ver el servicio`; alias `evolucion diaria` → evolución |

## Verificación

```bash
npm run db:migrate
npm test
```

Integración: `inpatient.integration.test.ts` (censo, órdenes activas, acuse INR).

## Journey

`golden-v2-admission-discharge` en [EPIS2_GOLDEN_JOURNEYS.md](../docs/quality/EPIS2_GOLDEN_JOURNEYS.md)
