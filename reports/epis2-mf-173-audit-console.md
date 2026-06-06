# MF-173 — Consola de auditoría

**Estado:** DONE | **Ola:** 4 | **Fecha:** 2026-06-04

## Alcance
UI admin para eventos de auditoría ya persistidos (lectura limitada).

## Entregables
- Pestaña Auditoría en `AdminConsolePage.tsx`
- `fetchAuditEvents` → `GET /api/audit/events?limit=…`

## Gates
`npm run check`; Golden G3 mantiene auditoría en aprobación; sin PHI nueva.

## Riesgos
Límite de eventos; sin export forense.

## Próximo paso
MF-174 — ops (`/api/ops/status`).
