# EPIS2

Aplicación clínica **command-first**, independiente del legacy EPIS. Demo local con datos **sintéticos** — no PHI real.

**Home clínica:** `/espacio/buscar-paciente` (censo + barra de comando). `/comando` solo compat.

---

## Qué es

Monorepo clínico modular: UI (`apps/web`), API + PostgreSQL (`apps/api`), contratos y registries (`packages/*`), IA local opcional (`services/local-ai`).

Flujo mínimo: **censo → ficha dual → borrador → aprobación humana**. IA propone; el clínico aprueba.

---

## Estado real (2026-06-16)

| Aspecto | Estado |
|---------|--------|
| Base demo v0.1 | Compila, golden journey, ficha-first ✓ · tag **`v0.1-demo-rc3`** · `master` incluye POST-RC3 |
| Programas recientes | **PROG-POST-RC3** ✓ tramos 1–5 · **PROG-RELEASE-HARDENING** RH-01…08 + RH-09/10/11 blocking |
| Congelamiento | Sin features clínicas nuevas salvo MF autorizada |
| Producción / PHI | **No listo** — ver seguridad abajo |

**Cierre POST-RC3:** [`reports/epis2-prog-post-rc3-close.md`](reports/epis2-prog-post-rc3-close.md) · **Branch protection:** [`reports/epis2-branch-protection-verify-2026-06-16.md`](reports/epis2-branch-protection-verify-2026-06-16.md)

**Fuente de verdad:** [`docs/EPIS2_CURRENT_STATE.md`](docs/EPIS2_CURRENT_STATE.md)

**Tablero:** [`docs/product/EPIS2_TABLERO.md`](docs/product/EPIS2_TABLERO.md)

Historial de fases EPIS2-00…12: [`docs/archive/PHASE_HISTORY.md`](docs/archive/PHASE_HISTORY.md)

---

## Qué NO es EPIS2

- No es un HIS hospitalario completo ni reemplazo de EPIS legacy.
- No usa PHI real en repo, tests ni demos documentadas.
- No es dashboard-first: el tablero `/epis2/dashboard` es secundario.
- No aprueba ni firma clínica de forma automática.

Límites: [`docs/NON_GOALS.md`](docs/NON_GOALS.md) · [`docs/SCOPE_V1.md`](docs/SCOPE_V1.md)

---

## Demo local

```bash
npm install
cp .env.example .env
docker compose up -d          # Postgres
npm run db:migrate
npm run dev:api               # :3001
npm run dev:web               # :5173
```

Abrir `http://127.0.0.1:5173` — credenciales demo: [`docs/auth/DEMO_USERS.md`](docs/auth/DEMO_USERS.md)

IA opcional (Ollama en host):

```bash
npm run stack:dev             # Postgres + smoke Ollama
npm run dev:ai                # :3002
```

---

## Arquitectura (corta)

```text
apps/web          UI React 19 + Vite + MUI
apps/api          Fastify + Drizzle + PostgreSQL (SoT)
packages/*        contracts, clinical-forms, command-registry, UI libs
services/local-ai IA asistida (JSON validado, sin escribir SoT)
```

Satélites HTTP (no imports cruzados): [epis2-evolab](https://github.com/gabriel2320/epis2-evolab), EPIS2-MedRepo.

Detalle: [`docs/ARCHITECTURE_TARGET.md`](docs/ARCHITECTURE_TARGET.md) · [`docs/MONOREPO_GOVERNANCE.md`](docs/MONOREPO_GOVERNANCE.md)

---

## Comandos principales

| Cuándo | Comando |
|--------|---------|
| Verificación rápida | `npm run quality:fast` |
| Pre-PR | `npm run quality:required` |
| Pre-tag release | `npm run quality:release` |
| Lint + types + arquitectura | `npm run check` |
| Tests unitarios | `npm run test` |
| DB | `npm run db:migrate` · `npm run db:validate` |
| Sesión agente Cursor | `npm run dev:session` |

Node: ver [`.nvmrc`](.nvmrc) (24). CI usa Node 24.

---

## Seguridad y no PHI

- Solo pacientes y usuarios **sintéticos** en desarrollo.
- `staging` / `production` exigen configuración fail-closed (`SESSION_SECRET`, `RLS_MODE=enforce`, `REDIS_URL`, sin auth demo).
- Credenciales demo en README/docs son **solo desarrollo** — no copiar a entornos desplegados.

Runbook RLS: [`docs/ops/RLS_STAGING_RUNBOOK.md`](docs/ops/RLS_STAGING_RUNBOOK.md)

Legal: [`DISCLAIMER.md`](DISCLAIMER.md) · [`SECURITY.md`](SECURITY.md) · [`CONTRIBUTING.md`](CONTRIBUTING.md) · [`LICENSE`](LICENSE)

---

## Documentación viva

| Documento | Propósito |
|-----------|-----------|
| [`docs/EPIS2_CURRENT_STATE.md`](docs/EPIS2_CURRENT_STATE.md) | **Estado ejecutivo** (manda sobre este README) |
| [`docs/DOCUMENTATION_GOVERNANCE.md`](docs/DOCUMENTATION_GOVERNANCE.md) | Qué doc manda en conflictos |
| [`docs/PRODUCT_CANON.md`](docs/PRODUCT_CANON.md) | Principios no negociables |
| [`docs/AGENT_CONTEXT_MINIMAL.md`](docs/AGENT_CONTEXT_MINIMAL.md) | Loop agentes Cursor |
| [`docs/INDEX.md`](docs/INDEX.md) | Índice L0…L5 |
| [`reports/README.md`](reports/README.md) | Reportes de sesión (histórico) |

Repositorio donante EPIS (`../Epis`): **`LEGACY_REFERENCE`** — no copiar sin `legacy-import-manifest.json`. Ver [`docs/LEGACY_DONOR_MAP.md`](docs/LEGACY_DONOR_MAP.md).

---

## Desarrollo (SDEPIS2)

Sistema olas / microfases: [`docs/product/EPIS2_DEV_SYSTEM.md`](docs/product/EPIS2_DEV_SYSTEM.md)

Guía agentes: [`AGENTS.md`](AGENTS.md)
