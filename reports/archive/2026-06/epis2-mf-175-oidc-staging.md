# MF-175 — OIDC staging (híbrido)

**Estado:** DONE | **Ola:** 5 | **Fecha:** 2026-06-04

## Alcance
Auth híbrida documentada: login demo + service key; OIDC real según ADR-006.

## Entregables
- `docs/ops/OIDC_STAGING.md`, `docs/auth/DEMO_USERS.md`
- ADR-006 en `docs/DECISIONS.md` (`AUTH_MODE=hybrid`)

## Gates
`npm run check`; baseline login MF-185; IdP real = post-alcance.

## Riesgos
Confusión OIDC completo vs híbrido; rotación manual de `SERVICE_API_KEY`.

## Próximo paso
MF-176 — `apps/api/src/security/rateLimit.ts`.
