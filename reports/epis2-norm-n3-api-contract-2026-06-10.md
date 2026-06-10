# EPIS2 — Hilo NORM · Tramo N3 (contrato API y seguridad documental) — cierre

**Fecha:** 2026-06-10 · **Plan:** [`EPIS2_NORMA_FULLSTACK_PLAN.md`](../docs/product/EPIS2_NORMA_FULLSTACK_PLAN.md)

## Microfases

| MF | Alcance | Commit | Gate |
|----|---------|--------|------|
| MF-NORM-302 | Threat model STRIDE ligero | `964d3a0` | doc + criterio signoff |
| MF-NORM-303 | ADR-001 versionado API (defer `/v1`) | `964d3a0` | ADR registrado |
| MF-NORM-301 | OpenAPI 3.1 desde Zod (`zod-openapi` + `zod/v4`); `GET /api/docs/openapi.json`; auth + drafts + search; artefacto `reports/openapi.json`; gate CI | *(este commit)* | `quality:openapi-gate` ✓ |

## MF-NORM-301 — detalle

- **`apps/api/src/openapi/`** — registry declarativo (no reescribe handlers Fastify).
- Schemas en `zod/v4` con `.meta({ id })` para components reutilizables; espejan contratos
  de `@epis2/contracts` y bodies de `clinical/routes.ts`.
- Rutas documentadas: `/api/auth/login|logout|session`, `/api/drafts` (+ `{draftId}`),
  `/api/patients`, `/api/patients/{patientId}/documents/search`.
- Validación: `@apidevtools/swagger-parser` en vitest + `quality:openapi-gate` en CI.

## Re-auditoría §8 / §9 (vs auditoría 2026-06-10)

| Sección | Antes | Ahora |
|---|---|---|
| §8 API R-33…R-35 | 🟡 | 🟢 — OpenAPI generada (R-33); paginación drafts (R-35, N1); `/v1` deferido ADR-001 |
| §9 Seguridad R-36…R-40 | 🟡 | 🟢 — threat model formal (302) |

## Próximo paso

Hilo NORM completo (16/16 MF). Cierre global: re-auditoría final ≥90% en
[`reports/epis2-norm-hilo-close-2026-06-10.md`](./epis2-norm-hilo-close-2026-06-10.md).
