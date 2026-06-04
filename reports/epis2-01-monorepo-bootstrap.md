# EPIS2-01 — Bootstrap del monorepo

**ID:** EPIS2-01  
**Estado:** Completada  
**Fecha:** 2026-06-04  
**Depende de:** EPIS2-00

---

## Objetivo

Estructura monorepo, TypeScript strict, lint, tests, Docker Compose (Postgres + Ollama), CI, `.env.example`, health checks — **sin shell clínico ni lógica de producto**.

---

## Entregables

| Área | Contenido |
|------|-----------|
| Workspaces | `apps/web`, `apps/api`, `packages/*`, `services/local-ai` |
| Tooling | ESLint 9, TypeScript 5 strict, Vitest |
| API | Fastify `/health`, `/ready`, `/api/meta` |
| IA local | Fastify `/health`, `/ready` + ping Ollama |
| Web | Vite + React placeholder (MUI en EPIS2-02) |
| DB | `database/migrations/001-002`, `db:validate` |
| Infra | `docker-compose.yml`, `.env.example`, GitHub CI |

---

## Gates

| Comando | Resultado |
|---------|-----------|
| `npm run check` | ✓ pass |
| `npm run test` | ✓ 5 tests |
| `npm run db:validate` | ✓ 2 migraciones |

---

## Archivos prohibidos respetados

- Sin OpenMRS, Carbon, overlays EPIS
- Sin lógica clínica, auth real ni command registry productivo

---

## Próximo paso

```text
Ejecutar solo EPIS2-02 — Sistema visual y shell.
No avanzar a EPIS2-03.
```

---

## Commit sugerido

```text
feat(epis2-01): monorepo bootstrap with health checks and CI

Add npm workspaces, Fastify API, local-ai service, Vite web stub,
PostgreSQL migrations validation, Docker Compose, and GitHub Actions.
```
