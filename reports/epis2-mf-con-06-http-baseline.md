# EPIS2 — MF-CON-06 baseline HTTP

**Fecha:** 2026-06-15 · **HEAD base:** `67b8118` · **Programa:** PROG-CONSOLIDATE ola 2 PR 006

## Alcance

MF-CON-06 — baseline HTTP (CSP, cookies, CORS) en API.

| Permitido | Prohibido |
|-----------|-----------|
| `apps/api/src/security/*` | migraciones, RBAC, features clínicas |
| `apps/api/src/app.ts`, `auth/routes.ts` | segundo registry |
| tests locales | commit automático |

## Entrega

- `security/httpBaseline.ts` — CSP, HSTS (staging/prod), helpers cookie/CORS
- `headers.ts` — headers config-aware (MF-CON-06)
- `app.ts` — CORS restringido vía `buildCorsOptions`
- `auth/routes.ts` — cookies centralizadas (`sessionCookieOptions` / `clearSessionCookieOptions`)
- Tests: `headers.test.ts` (5) · `auth.test.ts` (+1 cookie flags)

## Gates

- `npx vitest run apps/api/src/security/headers.test.ts apps/api/src/auth/auth.test.ts` — 13/13 ✓
- Pendiente cierre MF: `npm run quality:clinical`

## Riesgos

- HSTS asume HTTPS en staging/prod (proxy/TLS externo).
- CSP `default-src 'none'` es adecuada para API JSON; revisar si hay rutas HTML.

## Próximo paso

MF-CON-07 — rate limit Redis/Valkey en staging/prod · PR separado.
