# EPIS2 — Fix CI E2E webServer (.env)

**Fecha:** 2026-06-04  
**Alcance:** `scripts/run-api-dev.mjs` · `apps/api/package.json`

## Problema

CI run [27176997979](https://github.com/gabriel2320/epis2/actions/runs/27176997979): `npm run test:e2e` fallaba al arrancar la API:

```text
node: ../../.env: not found
tsx watch --env-file=../../.env src/server.ts → exit 9
```

`DATABASE_URL` ya estaba en el workflow; `tsx --env-file` exige archivo aunque las variables existan.

## Fix

- Nuevo `scripts/run-api-dev.mjs`: `loadEnvFile()` opcional + `tsx watch` vía `node_modules/tsx/dist/cli.mjs` (sin shell, compatible rutas con espacios en Windows).
- `apps/api` script `dev` apunta al wrapper.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| Smoke local sin `.env` + `DATABASE_URL` | API escucha en :3001 |

## Riesgos

Ninguno clínico. Desarrollo local con `.env` sigue igual (`loadEnvFile` no sobrescribe vars ya definidas).

## Próximo paso

Push y verificar CI verde en `test:e2e` → `golden-journey`.
