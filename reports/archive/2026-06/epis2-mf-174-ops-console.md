# MF-174 — Consola operacional

**Estado:** DONE | **Ola:** 4 | **Fecha:** 2026-06-04

## Alcance
Status operativo mínimo en admin demo (no sustituye observabilidad externa).

## Entregables
- Pestaña Operaciones en `AdminConsolePage.tsx`
- `fetchOpsStatus` → `apps/api/src/ops/routes.ts`

## Gates
`npm run check`; tests integración ops; home = Centro de Comando.

## Riesgos
Agregado puede ocultar fallos parciales (DB, local-ai).

## Próximo paso
MF-175 — documentar `AUTH_MODE=hybrid`.
