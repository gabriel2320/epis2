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
| **UI plana + slices** | Completado — tema monocromático, chips sin truncar, 11 blueprints, WIDGET-00 |

| **CI master** | Verde — 10/10 E2E preview ([run 27181266125](https://github.com/gabriel2320/epis2/actions/runs/27181266125)) |
| **EPIS2-PM-01 Tres modos** | Completado — PROG-THREE-MODES MF-01…08 |

**Sistema de desarrollo (SDEPIS2):** [`docs/product/EPIS2_DEV_SYSTEM.md`](docs/product/EPIS2_DEV_SYSTEM.md) · **Tablero:** [`docs/product/EPIS2_TABLERO.md`](docs/product/EPIS2_TABLERO.md)

## Evolab (repositorio externo)

El laboratorio de evolución supervisada **no vive en este monorepo**. Usa [epis2-evolab](https://github.com/gabriel2320/epis2-evolab), que apunta al sandbox EPIS2 vía HTTP sin acoplar código clínico.

Plan de mejora: [EVOLAB_ROADMAP.md](https://github.com/gabriel2320/epis2-evolab/blob/master/docs/evolution/EVOLAB_ROADMAP.md).

## Documentación esencial
| Documento | Propósito |
|-----------|-----------|
| [docs/INDEX.md](docs/INDEX.md) | **Índice maestro** — niveles L0…L5 y ciclo de vida documental |
| [docs/PRODUCT_CANON.md](docs/PRODUCT_CANON.md) | Visión y principios no negociables |
| [docs/SCOPE_V1.md](docs/SCOPE_V1.md) | MVP v1 limitado |
| [docs/NON_GOALS.md](docs/NON_GOALS.md) | Lo que EPIS2 no hará en v1 |
| [docs/ARCHITECTURE_TARGET.md](docs/ARCHITECTURE_TARGET.md) | Arquitectura objetivo |
| [docs/LEGACY_DONOR_MAP.md](docs/LEGACY_DONOR_MAP.md) | Migración selectiva desde EPIS |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Fases EPIS2-00 … EPIS2-12 + frontera producto |
| [docs/product/EPIS2_DEV_SYSTEM.md](docs/product/EPIS2_DEV_SYSTEM.md) | **SDEPIS2** — olas, hilos, tramos, microfases, entregas |
| [docs/product/EPIS2_TABLERO.md](docs/product/EPIS2_TABLERO.md) | Tablero de desarrollo (estado vivo) |
| [docs/SCOPE_V1.md](docs/SCOPE_V1.md) | MVP v1 + addendum slices demo |
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
npm run test              # sin DATABASE_URL: ~299 unit; con migrate: ~319 (0 skipped)
npm run quality:ci-parity # exige DATABASE_URL; falla si queda algún skip (paridad CI)
npm run db:validate
npm run quality:golden-journey   # journey spec + API (requiere DATABASE_URL)
npm run qa:bundle-analyze        # presupuestos MUI X (opcional)
npm run db:migrate   # requiere DATABASE_URL + Postgres
npm run stack:up       # Postgres + migrate + ai:enable (Ollama nativo en host)
docker compose up -d   # solo Postgres por defecto
npm run ai:enable      # verifica Ollama + pull qwen3:8b
npm run quality:local-ci   # replica gates CI local (Postgres + migrate)
npm run test:e2e:install && npm run test:e2e   # journey UI Playwright
npm run stack:dev        # Postgres + migrate + Ollama smoke
npm run dev:session      # brief IA + subagente primario (Cursor: @reports/dev-agent-brief.md)
npm run dev:ai         # puerto 3002 (dejar en terminal aparte)
npm run dev:api        # puerto 3001
npm run dev:web        # puerto 5173
```

Copia `.env.example` → `.env`. Por defecto: `OLLAMA_BASE_URL=http://127.0.0.1:11434`, `OLLAMA_MODEL=qwen3:8b`. En `docker-compose.yml`, los servicios en contenedor usan `http://host.docker.internal:11434`. Contenedor Ollama opcional: `docker compose --profile bundled-ollama up -d ollama`.

En el Centro de Comando verás el chip **IA local** en verde cuando Ollama y `dev:ai` estén activos.

## Próximo paso

**Plan A (estabilización UX + docs)** ✓ — `reports/epis2-ux-stabilization.md`.  
**Plan B (WIDGET-01)** ✓ — `reports/epis2-widget-01-mount.md`.  
**Plan C (V1 completo)** ✓ — `reports/epis2-v1-plan-c-complete.md`.  
**Plan D (V2 slice)** ✓ — ingreso/traslado/alta — `reports/epis2-v2-plan-d-slice.md`.  
**Plan E (V3)** ✓ — `reports/epis2-v3-plan-e-slice.md`.  
**Plan F (V4/V5 + hardening)** ✓ — `reports/epis2-plan-f-complete.md`.  
**Plan G (CI calidad)** ✓ — `reports/epis2-plan-g-complete.md`.

Demo en vivo:

```bash
docker compose up -d
npm run db:migrate
npm run dev:api    # :3001
npm run dev:web    # :5173
# http://127.0.0.1:5173 — medico.demo / DEMO-CLAVE-MEDICO
```

Servicio IA opcional: `npm run ai:enable` + `npm run dev:ai`.
