# EPIS2 V2 — Hospitalización operativa (slice demo)

**Ticket:** EPIS2-13 (parcial)  
**Estado:** censo sintético + tablero servicio + acuse de críticos.

## Entregables

| Área | Detalle |
|------|---------|
| **BD** | `clinical_units`, `beds`, `inpatient_admissions`, `clinical_critical_results` |
| **Seed** | Unidad `CIRUGIA-DEMO`; DEMO-004/005 en 101A/101B; INR crítico sin acuse |
| **API** | `GET /api/dashboard/service`, `POST /api/inpatient/critical-results/:id/acknowledge` |
| **UI** | Tab **Servicio** en Modo tablero (`ServiceDashboardTab`) |

## Verificación

```bash
npm run db:migrate
npm test
```

Comando: `ver el servicio` → censo → acusar INR en DEMO-005.

## Fuera de alcance (V2 completo)

- Órdenes activas, traslados, MAR, worklist multidisciplinario completo.

## Siguiente

- Gate humano journey V2; luego V3 enfermería/farmacia.
