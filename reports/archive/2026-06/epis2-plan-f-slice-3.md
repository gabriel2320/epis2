# EPIS2 — Plan F slice 3: RLS transacciones y auth híbrida

**Fecha:** 2026-06-05  
**Estado:** slice cerrado (demo)

## Entregables

| # | Entregable | Estado |
|---|------------|--------|
| F13 | `runWithRlsContext` — `SET LOCAL` en transacción Drizzle | ✓ |
| F14 | Rutas clínicas cableadas (pacientes, borradores CRUD/aprobación) | ✓ |
| F15 | Test integración RLS enforce (enfermería ≠ borradores médico) | ✓ |
| F16 | `AUTH_MODE=hybrid` + `SERVICE_API_KEY` (ADR-006 piloto) | ✓ |
| F17 | Ops `hardening.authMode` + `rlsTransactions` | ✓ |

## Configuración piloto

```bash
RLS_MODE=enforce
AUTH_MODE=hybrid
SERVICE_API_KEY=<min-32-chars>
```

Header integración: `X-EPIS2-Service-Key`

## Gates

```bash
npm run check && npm run test && npm run db:validate && npm run ai:evals
```

## Pendiente Plan F completo

- RLS en dashboard/IA (más rutas)
- OIDC producción (ADR-006 completo)
- Observabilidad métricas/tracing

## Cierre

Plan F signoff: `reports/archive/2026-06/epis2-plan-f-complete.md`
