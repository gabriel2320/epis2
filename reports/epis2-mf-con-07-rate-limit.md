# EPIS2 — MF-CON-07 rate limit Redis

**Fecha:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE ola 2 PR 007

## Alcance

MF-CON-07 — rate limit distribuido en staging/production.

| Permitido | Prohibido |
|-----------|-----------|
| `apps/api/src/security/*`, `config*` | features clínicas |
| `.env*.example`, `ops/service.ts` | migraciones |

## Entrega

- `rateLimitStore.ts` — `MemoryRateLimitStore` + factory
- `rateLimitRedis.ts` — `RedisRateLimitStore` (INCR/EXPIRE)
- `rateLimit.ts` — store inyectable vía `setRateLimitStore`
- `config.ts` — `REDIS_URL` obligatorio staging/prod
- `app.ts` — bootstrap store al arrancar
- Ops status — `rateLimitBackend: memory|redis`

## Gates

- vitest security + config + auth — pendiente cierre
- `npm run dev:rapid`

## Próximo paso

PR 007 → MF-CON-03 gobierno monorepo o MF-CON-11 CI split.
