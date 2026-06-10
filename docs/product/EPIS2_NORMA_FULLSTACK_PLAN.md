# EPIS2 — Plan de mejora: Norma full stack (Hilo NORM)

> Derivado de la auditoría [`reports/epis2-norma-fullstack-compliance-2026-06-10.md`](../../reports/epis2-norma-fullstack-compliance-2026-06-10.md) (cumplimiento ≈70%, HEAD `648e88d`).
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
| **MF-NORM-203** | OpenTelemetry mínimo: instrumentación HTTP + pg, exporter OTLP detrás de flag `OTEL_ENABLED` (off por defecto en dev); documentar en `docs/dev/` | `apps/api/src/otel.ts`, `package.json`, `docs/dev/**` | smoke: arranque con y sin flag; spans visibles en collector local |

**Cierre N2:** reporte + actualización de §11 en la auditoría (🔴 → 🟢).

---

## Tramo N3 — Contrato API y seguridad documental (2–3 sesiones, costo M)

| MF | Alcance | Archivos permitidos | Gate de cierre |
|----|---------|---------------------|----------------|
| **MF-NORM-301** | OpenAPI generado desde Zod (`fastify-zod-openapi` o `zod-openapi`): spec servida en `/api/docs/openapi.json`, artefacto en CI; sin reescribir rutas | `apps/api/**`, `package.json`, CI | spec generada cubre rutas drafts/search/auth; validador OpenAPI verde |
| **MF-NORM-302** ✓ | Threat model formal (STRIDE ligero): actores, superficies (auth, drafts, AI assist, import legacy), mitigaciones existentes (RBAC, RLS, audit), riesgos aceptados; gate doc en signoff | `docs/security/EPIS2_THREAT_MODEL.md`, checklist signoff (criterio 6) | `964d3a0` — revisión humana pendiente de signoff |
| **MF-NORM-303** ✓ | Decisión versionado API: ADR corto (`/v1` vs header vs defer) — **decidir, no necesariamente implementar** antes del primer despliegue externo | `docs/adr/ADR-001-api-versioning.md` | `964d3a0` — defer aceptado; gate al primer consumidor externo |

**Cierre N3:** reporte + ADR registrado.

---

## Tramo N4 — UI, accesibilidad y E2E (2–4 sesiones, costo M/L)

| MF | Alcance | Archivos permitidos | Gate de cierre |
|----|---------|---------------------|----------------|
| **MF-NORM-401** ✓ | axe-core smoke: `@axe-core/playwright` sobre 3 pantallas (Centro de Comando, ficha, formulario clínico); umbral: 0 violaciones `serious`/`critical`; job CI | `e2e/a11y-smoke.spec.ts`, `package.json`, CI | spec creada (`75097fb`); **detectó violaciones reales** → CI bloqueado por 401b |
| **MF-NORM-401b** | Corregir violaciones axe detectadas: `button-name` (critical, IconButtons rail `epis2-nav-workspace-*` sin aria-label), `color-contrast` (CTAs `open-classic`/`open-dashboard`, `ficha-history`), `label-title-only` + `list` (formulario evolución); luego activar `test:e2e:a11y` en CI | `apps/web/src/**`, tema (coordinar con signoff M3-R), CI | `npm run test:e2e:a11y` verde + paso CI activo |
| **MF-NORM-402** ✓ | Política selectores E2E role-first: documento corto + helper `e2e/support/queries.ts`; regla: specs **nuevos** usan `getByRole`/`getByLabel`; los 89% `getByTestId` existentes se migran oportunísticamente, no en masa | `docs/quality/E2E_SELECTOR_POLICY.md`, `e2e/support/**` | `75097fb` — piloto = spec a11y role-first |
| **MF-NORM-403** | Drawer móvil: navegación colapsa a `Drawer` modal MD3 bajo breakpoint `md`; sin tocar registries; Storybook story + viewport test | `apps/web/src/components/` (shell de navegación), stories, e2e viewport | e2e con viewport 390px verde + `quality:three-modes-gate` |
| **MF-NORM-404** | Mapeo server→field errors en RHF: cuando `ApiErrorSchema.details` trae paths Zod, `setError` por campo en `useEpisClinicalBlueprintForm` (depende de MF-NORM-202) | `apps/web/src/hooks/**`, tests unitarios | test unitario de mapeo verde |

**Cierre N4:** reporte + re-auditoría §4/§5/§10.

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
