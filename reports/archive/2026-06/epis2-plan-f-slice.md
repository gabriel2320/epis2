# EPIS2 — Plan F slice: gates V4/V5 y hardening inicial

**Fecha:** 2026-06-05  
**Estado:** slice cerrado (demo)

## Entregables

| # | Entregable | Estado |
|---|------------|--------|
| F1 | `golden-v4-interop-ops` en `golden-clinical-journey.api.spec.ts` | ✓ |
| F2 | `golden-v5-ai-traceable` en CI | ✓ |
| F3 | `POST /api/commands/suggest` — NL intent sin ejecutar | ✓ |
| F4 | `npm run db:backup` (`scripts/epis-db-backup.mjs`) | ✓ |
| F5 | Rate limit login (20/15min por IP) | ✓ |
| F6 | `PROMPT_CATALOG_VERSION` en capacidades IA | ✓ |

## Pendiente Plan F completo

- RLS activación en migraciones (diseño ADR-005)
- Auth real post-demo
- Evals sintéticas IA
- Observabilidad ampliada (métricas/tracing)
- Rate limits en más endpoints

## Gates

```bash
npm run check
npm run test
npm run db:validate
npm run quality:golden-journey   # DATABASE_URL
```

## Continuación

Slice 2: `reports/epis2-plan-f-slice-2.md` (RLS piloto, evals, rate limits ampliados).

## Cierre

Plan F completo: `reports/archive/2026-06/epis2-plan-f-complete.md`
