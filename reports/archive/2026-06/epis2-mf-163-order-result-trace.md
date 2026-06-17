# EPIS2 — MF-163 Trazabilidad orden → resultado

**Fecha:** 2026-06-06

## Alcance

Enlace lectura entre órdenes `lab`/`imaging` y resultados en la bandeja (`/espacio/resultados`).

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `026_order_result_trace.sql` | Columna `clinical_order_id` + seeds demo DEMO-004/005 |
| `getPatientResultsInbox` | `orderId`/`orderTitle` en resultados; órdenes cumplidas fuera de `pendingOrders` |
| UI | Columna «Orden origen» en grid; críticos y pendientes muestran trazabilidad |
| Test | `resultsInbox.integration.test.ts` caso MF-163 |

## Gates

- `npm run check`
- `npm run test`
- `npm run db:validate` (26 migraciones)

## Próximo paso

**MF-164** — `EpisTrendChart` en contexto resultados.
