# EPIS2 — Plan F slice 2: RLS piloto, evals y rate limits

**Fecha:** 2026-06-05  
**Estado:** slice cerrado (demo)

## Entregables

| # | Entregable | Estado |
|---|------------|--------|
| F7 | Migración `022_epis2_rls_pilot.sql` — RLS off/enforce por sesión | ✓ |
| F8 | `apps/api/src/db/rls.ts` — helper SET LOCAL (ADR-005) | ✓ |
| F9 | Evals sintéticas V5 — `syntheticEvals.ts` + `npm run ai:evals` | ✓ |
| F10 | Rate limit comandos (60/min) e IA (30/min) | ✓ |
| F11 | `GET /api/ops/status` — bloque `hardening` | ✓ |
| F12 | `RLS_MODE` en config (`off` default, `enforce` piloto) | ✓ |

## Uso

```bash
# Evals IA sin Ollama
npm run ai:evals

# RLS enforce (piloto — requiere SET LOCAL en transacciones API)
RLS_MODE=enforce npm run dev:api
```

## Pendiente Plan F completo

- Cablear `SET LOCAL` en transacciones Drizzle (enforce real)
- Auth real post-demo (ADR-006)
- Observabilidad métricas/tracing

## Gates

```bash
npm run check && npm run test && npm run db:validate && npm run ai:evals
```

## Continuación

Slice 3: `reports/epis2-plan-f-slice-3.md` (RLS transacciones + auth híbrida).

## Cierre

Plan F+G: `reports/archive/2026-06/epis2-plan-f-complete.md` · `reports/archive/2026-06/epis2-plan-g-complete.md`
