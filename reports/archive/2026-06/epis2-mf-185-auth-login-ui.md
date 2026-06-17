# MF-185 — Auth UI /login sin redirect 401

**Estado:** DONE  
**Fecha:** 2026-06-05

## Cambio

`apiFetch` no redirige a `/sesion-expirada` en rutas `/login` y `/sesion-expirada`.

Test: `apps/web/src/api/client.test.ts`

## E2E

`e2e/golden-draft-approval.spec.ts` usa login UI nativo.

## Próximo

MF-186 (cerrado en misma sesión).
