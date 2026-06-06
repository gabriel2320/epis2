# EPIS2 V2 — Hospitalización operativa (slice demo)

**Ticket:** EPIS2-13 (gate V2 demo cerrado)  
**Commits:** `aaa6e7d`, `8470f38`, `bfbe52c` (Plan D API), signoff UI 2026-06-05  
**Ver también:** `reports/epis2-v2-plan-d-slice.md`, `reports/epis2-v2-ui-signoff.md`

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
