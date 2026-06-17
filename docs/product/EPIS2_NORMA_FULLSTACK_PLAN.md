# EPIS2 — Plan de mejora: Norma full stack (Hilo NORM)

> Derivado de la auditoría [`reports/archive/2026-06/epis2-norma-fullstack-compliance-2026-06-10.md`](../../reports/archive/2026-06/epis2-norma-fullstack-compliance-2026-06-10.md) (cumplimiento ≈70%, HEAD `648e88d`).
> Nomenclatura SDEPIS2: **Hilo NORM** · tramos N1–N4 · microfases `MF-NORM-xxx`.

---

## Reglas del hilo

1. **PEND-011 (CI rojo E2E impresión) bloquea el arranque** — no abrir microfases NORM con CI rojo; primero verde.
2. Una microfase = una sesión = un commit verificable con gate de cierre.
3. Nada de este hilo toca lógica clínica ni SoT; si una microfase lo requiere, se detiene y se re-planifica.
4. Cada tramo cierra con `npm run check` + `npm run test` + reporte en `reports/`.
5. Las microfases dentro de un tramo son paralelizables salvo dependencia explícita (→).

---

## Tramo N1 — Quick wins (1–2 sesiones, costo S)

Bajo riesgo, sin decisiones de diseño. Paralelizable al 100%.

| MF | Alcance | Archivos permitidos | Gate de cierre |
|----|---------|---------------------|----------------|
| **MF-NORM-101** ✓ | `apps/web/tsconfig.json` extiende `tsconfig.base.json` (gana `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`); corregir errores que aflore (~94 en 46 archivos) | `apps/web/tsconfig.json`, fixes puntuales en `apps/web/src/**` | `6584d31` — typecheck 0 errores, vitest web 165/165 ✓ |
| **MF-NORM-102** ✓ | Rutas health estándar: `/health/live` (proceso) + `/health/ready` (DB ping); `/health` y `/ready` quedan como alias legacy | `apps/api/src/app.ts`, tests | `eb759d5` — 4 tests ✓ |
| **MF-NORM-103** ✓ | Prettier: `format` + `format:check` en `package.json`; formatear repo en commit aislado; paso `format:check` en CI | `package.json`, `.prettierrc*`, `.github/workflows/ci.yml` | scaffolding `c5142a7` + formateo masivo `425aec6` (1238 archivos) — `format:check` ✓ |
| **MF-NORM-104** ✓ | Pin de Node: `.nvmrc` = 20 (paridad CI) + `engines >=20 <25` + nota en velocity doc | `.nvmrc`, `package.json`, `docs/dev/**` | `c5142a7` |
| **MF-NORM-105** ✓ | Paginación `listDrafts`: `limit` default 50 / max 100 + `offset`, validado con Zod en contracts; SQL `WHERE`/`ORDER BY`/`LIMIT` | `packages/contracts/**`, `apps/api/src/clinical/*`, tests | `ce0bff5` — integración 55 drafts ✓ + 4 unit ✓ |

**Cierre N1:** reporte `reports/epis2-norm-n1-*.md`.

---

## Tramo N2 — Observabilidad y errores (2–3 sesiones, costo M)

La sección peor evaluada (§11 🔴). Orden: 201 → 202 → 203.

| MF | Alcance | Archivos permitidos | Gate de cierre |
|----|---------|---------------------|----------------|
| **MF-NORM-201** ✓ | Logging estructurado: pino explícito (nivel `LOG_LEVEL` validado Zod, redact authorization/cookie), `correlationId` por request vía `requestIdHeader`/`requestIdLogLabel` y header `x-correlation-id` en toda respuesta | `apps/api/src/app.ts`, `config.ts`, tests | `21fc02e` — 3 tests ✓ |
| **MF-NORM-202** ✓ | Envelope de error compartido: schema Zod `apiErrorSchema` (`code`, `message`, `correlationId`, `details?`) en `packages/contracts`; `setErrorHandler`/`setNotFoundHandler` globales + helper `sendApiError`; 70 sitios `{ error }` migrados en 11 archivos; `ApiError` web expone `code`/`correlationId`/`details` | `packages/contracts/**`, `apps/api/src/**` (handler + rutas), `apps/web/src/api/client.ts` (parseo) | `errors.envelope.test.ts` 5/5 ✓ (400/401/403/404/500 cumplen schema; 500 con mensaje genérico) |
| **MF-NORM-203** ✓ | OpenTelemetry mínimo: `NodeSDK` con instrumentación HTTP entrante (node:http/Fastify) + saliente (undici/fetch → local-ai/Ollama), exporter OTLP tras flag `OTEL_ENABLED` (off por defecto); **DB:** `postgres.js` sin instrumentación OTel oficial → span manual como extensión futura; `startOtel` antes del import dinámico de `app.js` (ESM); doc `docs/dev/EPIS2_OBSERVABILITY_OTEL.md` | `apps/api/src/otel.ts`, `server.ts`, `config.ts`, `package.json`, `docs/dev/**` | smoke 3/3 ✓ (sin flag → null; con flag → spans en exporter memoria; arranque real `dist/server.js` con flag HTTP 200) |

**Cierre N2:** ✓ §11 pasa de 🔴 a 🟢 (201 correlationId+pino, 202 envelope, 203 OTel opt-in).

---

## Tramo N3 — Contrato API y seguridad documental (2–3 sesiones, costo M)

| MF | Alcance | Archivos permitidos | Gate de cierre |
|----|---------|---------------------|----------------|
| **MF-NORM-301** ✓ | OpenAPI 3.1 generado desde Zod (`zod-openapi` + schemas `zod/v4` en `apps/api/src/openapi/`): spec en `GET /api/docs/openapi.json`; cubre auth (login/session/logout), drafts (CRUD paginado) y search (pacientes + documentos); artefacto CI `reports/openapi.json`; validador `@apidevtools/swagger-parser` | `apps/api/src/openapi/**`, `package.json`, CI | `quality:openapi-gate` ✓ + `app.test.ts` GET spec ✓ |
| **MF-NORM-302** ✓ | Threat model formal (STRIDE ligero): actores, superficies (auth, drafts, AI assist, import legacy), mitigaciones existentes (RBAC, RLS, audit), riesgos aceptados; gate doc en signoff | `docs/security/EPIS2_THREAT_MODEL.md`, checklist signoff (criterio 6) | `964d3a0` — revisión humana pendiente de signoff |
| **MF-NORM-303** ✓ | Decisión versionado API: ADR corto (`/v1` vs header vs defer) — **decidir, no necesariamente implementar** antes del primer despliegue externo | `docs/adr/ADR-001-api-versioning.md` | `964d3a0` — defer aceptado; gate al primer consumidor externo |

**Cierre N3:** ✓ [`reports/archive/2026-06/epis2-norm-n3-api-contract-2026-06-10.md`](../../reports/archive/2026-06/epis2-norm-n3-api-contract-2026-06-10.md) — OpenAPI desde Zod + ADR-001 + threat model.

---

## Tramo N4 — UI, accesibilidad y E2E (2–4 sesiones, costo M/L)

| MF | Alcance | Archivos permitidos | Gate de cierre |
|----|---------|---------------------|----------------|
| **MF-NORM-401** ✓ | axe-core smoke: `@axe-core/playwright` sobre 3 pantallas (Centro de Comando, ficha, formulario clínico); umbral: 0 violaciones `serious`/`critical`; job CI | `e2e/a11y-smoke.spec.ts`, `package.json`, CI | spec creada (`75097fb`); en CI vía `test:e2e` desde 401b |
| **MF-NORM-401b** ✓ | Violaciones axe corregidas: `button-name` (aria-label en items del rail `EpisNavigationRail`), `color-contrast` (CTAs pequeños → `primary.dark`/onPrimaryContainer M3 sobre surfaceContainer, 8:1), `label-title-only` (id asociable en `EpisDatePicker` + htmlFor del label clínico), `list` (scrollspy `ul>li>button`); `a11y-smoke` añadido a `test:e2e` (CI) | `apps/web/src/**`, `packages/epis2-ui/src/**`, `package.json` | `test:e2e` 18/18 ✓ (incluye 3 specs a11y con 0 serious/critical) |
| **MF-NORM-402** ✓ | Política selectores E2E role-first: documento corto + helper `e2e/support/queries.ts`; regla: specs **nuevos** usan `getByRole`/`getByLabel`; los 89% `getByTestId` existentes se migran oportunísticamente, no en masa | `docs/quality/E2E_SELECTOR_POLICY.md`, `e2e/support/**` | `75097fb` — piloto = spec a11y role-first |
| **MF-NORM-403** ✓ | Drawer móvil: bajo breakpoint medium (<768px) `EpisAppShellLayout` colapsa el rail a `EpisMobileNavDrawer` (Drawer modal MD3, mismos items/data-testid del rail, trigger «Abrir navegación» junto al app bar); sin tocar registries; story + unit jsdom (matchMedia stub) + e2e viewport 390px (`test:e2e:mobile`, incluido en `test:e2e`) | `packages/epis2-ui/src/clinical/**`, stories, `e2e/mobile-drawer.spec.ts`, `package.json` | e2e 390px 2/2 ✓ + `quality:three-modes-gate` ✓ + `npm run check` ✓ |
| **MF-NORM-404** ✓ | Mapeo server→field errors en RHF: `applyServerFieldErrors` mapea `details` del envelope (paths Zod, p. ej. `body.<fieldId>`) a `setError(type: 'server')`; cableado en `useGeneratedFormDraftPersistence` (si aplica a campos, muestra «corrige los campos» en vez del error global); API emite `details` en 400 de create/update draft | `apps/web/src/clinical/applyServerFieldErrors.ts`, `generated-form/useGeneratedFormDraftPersistence.ts`, `GeneratedClinicalFormPage.tsx`, `apps/api/src/clinical/routes.ts` | 3 unit de mapeo ✓ + integración 400 con `details.path=patientId` ✓ |

**Cierre N4:** ✓ [`reports/archive/2026-06/epis2-norm-n4-ui-a11y-e2e-2026-06-10.md`](../../reports/archive/2026-06/epis2-norm-n4-ui-a11y-e2e-2026-06-10.md) — re-auditoría §4 🟢 · §5 🟢 · §10 🟢/🟡; cumplimiento ≈85% (≥90% requiere 203 + 301, en pausa por trabajo paralelo).

---

## Secuencia y paralelización

```text
PEND-011 (CI verde) ──► N1 (todo paralelo)
                          ├─► N2: 201 → 202 → 203
                          ├─► N3: 301 ∥ 302 ∥ 303
                          └─► N4: 401 ∥ 402 ∥ 403 · 404 tras 202
```

- **Sesión tipo A (backend):** subagente `tramo-implementer` → N2.
- **Sesión tipo B (docs/seguridad):** dev write L0 (`dev:agent:ollama-write`) puede borradorar MF-NORM-302/303.
- **Sesión tipo C (UI/E2E):** subagente `layers-integrator` / `golden-guardian` → N4.

## Seguimiento

- Registrar el hilo en `docs/product/EPIS2_TABLERO.md` como **Hilo NORM** con tramo activo.
- Cada MF cerrada se marca aquí con ✓ + link al reporte.
- Re-auditar al cierre de N4: objetivo **≥90%** de la norma con evidencia.

## Explícitamente fuera de alcance

- Migración a microservicios, pnpm/Turborepo (rechazado en auditoría).
- MSW (reevaluar solo si crecen tests de componentes con HTTP).
- Implementación de `/v1` (solo decisión ADR en MF-NORM-303).
- RLS en todas las tablas (continúa su propio plan por olas, no este hilo).
