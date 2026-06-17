# MF-176 — Rate limits

**Estado:** DONE | **Ola:** 5 | **Fecha:** 2026-06-04

## Alcance
Límites de tasa en API (memoria en proceso) con tests negativos.

## Entregables
- `security/rateLimit.ts`, `rateLimit.test.ts`
- Uso en handlers según config API existente

## Gates
`npm run test` (rateLimit); `npm run check`; no HA multi-instancia.

## Riesgos
Buckets no distribuidos; NAT puede agregar falsos positivos.

## Próximo paso
MF-177 — `npm run db:restore`.
