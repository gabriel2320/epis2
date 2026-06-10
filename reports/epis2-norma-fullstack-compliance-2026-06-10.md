# EPIS2 — Auditoría de cumplimiento: Norma full stack MD3 + React + Node + PostgreSQL

**Fecha:** 2026-06-10 · **HEAD auditado:** `648e88d`  
**Método:** dos auditorías paralelas read-only (frontend R-06…R-19/R-42/R-44 · backend R-01…R-05/R-20…R-48 + gates CI)  
**Plan derivado:** [`docs/product/EPIS2_NORMA_FULLSTACK_PLAN.md`](../docs/product/EPIS2_NORMA_FULLSTACK_PLAN.md)

---

## Veredicto

**Cumplimiento global ≈ 70%.** El núcleo (capas, contratos Zod, tema M3 único, constraints PG, migraciones, transacciones, RBAC/RLS, auditoría) cumple y además está **protegido por gates automáticos**, algo que la norma no exige. Las brechas se concentran en observabilidad, documentación de seguridad, contrato OpenAPI y disciplina de selectores E2E.

---

## Matriz por sección

| Sección | Estado | Evidencia clave | Brecha principal |
|---|---|---|---|
| §2 Principios R-01…R-05 | 🟢 | `packages/clinical-domain` sin deps runtime; monorepo conforme | Use-cases viven en `apps/api/*/service.ts` (sin capa aplicación separada) |
| §4 MD3 R-06…R-12 | 🟢/🟡 | `create-epis2-theme.ts` + gates `single-epis2-theme`, `no-direct-mui-imports`, `validate-no-hardcoded-colors`; focus-visible 2/3px; touch target 48px; tests contraste | Sin drawer móvil bajo `md`; sin axe-core; sin gate de px arbitrarios |
| §5 React/TS R-13…R-19 | 🟡 | `tsconfig.base.json` estricto; ~0 `any`; TanStack Query; RHF+Zod (`useEpisClinicalBlueprintForm`); lazy parcial | `apps/web/tsconfig` no extiende base (sin `exactOptionalPropertyTypes`); 2 componentes >600 líneas; sin mapeo server→field errors |
| §6 Node R-20…R-25 | 🟡 | Fastify 5; rutas delgadas con Zod + preHandler RBAC; `envSchema.parse` al arrancar; RLS fail-closed prod | Sin `correlationId`; envelope error ad-hoc `{ error }`; Node solo `engines >=20` |
| §7 PostgreSQL R-26…R-32 | 🟢 | 33 migraciones SQL + `epis2_schema_migrations` (checksum); PK/FK/CHECK; Drizzle; `db.transaction` en approveDraft; RLS piloto 3 tablas; `db:backup`/`db:restore` | RLS solo 3 tablas; backup sin schedule/runbook ops |
| §8 API R-33…R-35 | 🟡 | `/api/*` con límites en search (50/20) y ai/runs (cap 100) | Sin OpenAPI; sin `/v1`; `listDrafts` sin límite |
| §9 Seguridad R-36…R-40 | 🟡 | JWT (jose) + RBAC matrix + `requirePermission`; secretos fuera de git; `audit_events` en transacción | **Sin threat model formal** |
| §10 Pruebas R-41…R-44 | 🟡 | 15 integration tests con PG real; golden journey; Playwright; Storybook 13 stories | E2E **89% `getByTestId`** (R-44 ✗); sin MSW; sin axe-core |
| §11 Observabilidad R-45…R-48 | 🔴 | Pino implícito (Fastify default); `/health` + `/ready` con DB ping | Sin OTel; sin correlación; rutas health no estándar |
| §14 Gates CI | 🟡 ~9/14 | install, typecheck, lint, unit+integration, migrations, e2e, npm audit, bundle budget + gates EPIS2 propios | Faltan: format check, contratos dedicados, a11y automatizada |

---

## Fortalezas que exceden la norma

1. Gates arquitectónicos en CI: single theme, no-direct-MUI, single command/form/widget registry, `ai-write-boundary`, `human-approval-required`, `web-components-root-frozen`.
2. Tabla de control de migraciones con checksum y baseline.
3. RLS con modo fail-closed obligatorio en producción.
4. Auditoría clínica emitida dentro de la misma transacción que la aprobación.
5. Presupuesto de bundle gzip en CI.

---

## Brechas priorizadas (entrada del plan)

| # | Brecha | Regla | Costo | Impacto |
|---|--------|-------|-------|---------|
| 1 | `correlationId` + pino estructurado | R-45/R-46 | M | Alto |
| 2 | Threat model formal | R-36 | M | Alto |
| 3 | Política selectores E2E role-first | R-44 | M | Alto (estabilidad CI) |
| 4 | Envelope de error compartido en contracts | R-25 | M | Alto |
| 5 | OpenAPI desde Zod + paginación `listDrafts` | R-33/R-34/R-35 | M/L | Medio |
| 6 | axe-core smoke en CI | R-12/§14 | S | Medio |
| 7 | `apps/web/tsconfig` extiende base | R-13 | S | Medio |
| 8 | Drawer móvil bajo `md` | R-11 | M | Medio |
| 9 | Prettier `format:check` (+ gate CI) | §14 | S | Bajo |
| 10 | `/health/live` + `/health/ready` | R-48 | S | Bajo |
| 11 | OpenTelemetry mínimo (HTTP + DB) | R-47 | L | Medio |
| 12 | `.nvmrc` / pin Node | R-20 | S | Bajo |

S = sesión corta · M = 1 sesión · L = multi-sesión

---

## No-acciones justificadas

- **Microservicios:** la norma misma prefiere monolito modular (R-03) — EPIS2 ya lo es.
- **Migrar a pnpm/Turborepo:** npm workspaces funciona; cambio de tooling sin beneficio inmediato.
- **MSW:** valor limitado mientras la integración usa PG real + fixtures; reevaluar si crecen tests de componentes con HTTP.
- **`/v1` URL versioning:** romper rutas actuales no se justifica pre-release; decidir antes del primer despliegue externo.

---

*Auditoría ejecutada por subagentes explore en paralelo · sesión SDEPIS2 2026-06-10.*
