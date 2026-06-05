# EPIS2

Aplicación clínica **command-first**, independiente del proyecto EPIS (legacy).

## Estado del repositorio

| Fase actual | Estado |
|-------------|--------|
| **EPIS2-00** | Completada — canon, alcance, migración, reglas Cursor |
| **EPIS2-01** | Completada — monorepo, tooling, health checks, Docker |
| **EPIS2-02** | Completada — MUI, Centro de Comando `/comando` |
| **EPIS2-03** | Completada — auth API, RBAC, sesión cookie, auditoría login |
| **EPIS2-04** | Completada — núcleo PostgreSQL, borradores, aprobaciones |
| **EPIS2-05** | Completada — Command Registry, router, API resolve |
| **EPIS2-06** | Completada — 6 formularios desde blueprints (sin IA) |
| **EPIS2-07** | Completada — IA local Ollama, proxy API, `ai_runs` |
| **EPIS2-08** | Completada — borradores, versiones, aprobación humana UI |
| **EPIS2-09** | Completada — 5 casos demo sintéticos, badge DEMO |
| **EPIS2-10** | Completada — export FHIR R4 (frontera API) |
| **EPIS2-11** | Completada — journey dorado API + checklist piloto humano |
| **EPIS2-12** | Completada — Modo tablero «Mi trabajo» (`/epis2/dashboard`) |

### Capa experiencia (MUI + Material 3 Clinical)

| Track | Estado |
|-------|--------|
| **MUI-01…10** | Completado — tema, catálogo, formularios, Data Grid, Date Pickers, Charts, Tree, Dashboard shell, Scheduler spike |
| **M3-00…09** | Completado — tokens M3, `createEpis2Theme`, primitivos, reskin Login/Comando/clínico/tablero, preferencias, QA signoff |

Reportes: `reports/epis2-m3-09-qa-signoff.md` · `reports/epis2-m3-09-bundle-budget.md`

## Documentación esencial

| Documento | Propósito |
|-----------|-----------|
| [docs/PRODUCT_CANON.md](docs/PRODUCT_CANON.md) | Visión y principios no negociables |
| [docs/SCOPE_V1.md](docs/SCOPE_V1.md) | MVP v1 limitado |
| [docs/NON_GOALS.md](docs/NON_GOALS.md) | Lo que EPIS2 no hará en v1 |
| [docs/ARCHITECTURE_TARGET.md](docs/ARCHITECTURE_TARGET.md) | Arquitectura objetivo |
| [docs/LEGACY_DONOR_MAP.md](docs/LEGACY_DONOR_MAP.md) | Migración selectiva desde EPIS |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Fases EPIS2-00 … EPIS2-12 |
| [docs/design/M3_ADOPTION_PLAN.md](docs/design/M3_ADOPTION_PLAN.md) | Plan Material 3 Clinical (M3-00…09) |
| [docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md](docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md) | Especificación M3 |
| [docs/quality/M3_ANTI_DRIFT_GATES.md](docs/quality/M3_ANTI_DRIFT_GATES.md) | Gates anti-deriva M3 |
| [docs/product/EPIS2_RELEASE_ROADMAP.md](docs/product/EPIS2_RELEASE_ROADMAP.md) | Roadmap producto V0–V5 |
| [docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md](docs/product/EPIS2_COMPLETE_CAPABILITY_MAP.md) | Mapa de capacidades |
| [reports/epis2-complete-emr-product-plan.md](reports/epis2-complete-emr-product-plan.md) | Plan maestro EMR (2026-06) |
| [reports/epis2-project-audit-2026-06-05.md](reports/epis2-project-audit-2026-06-05.md) | Auditoría de proyecto (2026-06) |
| [reports/epis2-00-foundation-and-migration-plan.md](reports/epis2-00-foundation-and-migration-plan.md) | Informe fase EPIS2-00 |

## Repositorio donante

EPIS (`../Epis`) queda en estado **`LEGACY_REFERENCE`**. No copiar su arquitectura ni dependencias aquí.

## Desarrollo local

```bash
npm install
npm run check
npm run test              # con DATABASE_URL: 182 tests (integración + golden API)
npm run db:validate
npm run quality:golden-journey   # journey spec + API (requiere DATABASE_URL)
npm run qa:bundle-analyze        # presupuestos MUI X (opcional)
npm run db:migrate   # requiere DATABASE_URL + Postgres
docker compose up -d   # PostgreSQL (host **5433**); Ollama opcional si usas la app nativa
npm run ai:enable      # Ollama nativo (Windows/macOS) o Docker; pull del modelo en .env
npm run dev:ai         # puerto 3002 (dejar en terminal aparte)
npm run dev:api        # puerto 3001
npm run dev:web        # puerto 5173
```

Copia `.env.example` → `.env` y confirma `LOCAL_AI_BASE_URL=http://127.0.0.1:3002` y `OLLAMA_BASE_URL=http://127.0.0.1:11434`.

En el Centro de Comando verás el chip **IA local** en verde cuando Ollama y `dev:ai` estén activos.

## Próximo paso

**MVP v1 (EPIS2-00…12) y M3-09 cerrados en código.** Frontera actual: **piloto humano** con `docs/quality/PILOT_DEMO_CHECKLIST.md` · `npm run quality:golden-journey` (CI en GitHub incluye Postgres + migrate).

Servicio IA: `npm run ai:enable` + `npm run dev:ai` (opcional; la app funciona sin Ollama).

Usuarios demo: `docs/auth/DEMO_USERS.md`. Migraciones: `npm run db:migrate`.
