# EPIS2

Aplicación clínica **command-first**, independiente del proyecto EPIS (legacy).

## Estado del repositorio

| Fase actual | Estado |
|-------------|--------|
| **EPIS2-00** | Completada — canon, alcance, migración, reglas Cursor |
| **EPIS2-01** | Completada — monorepo, tooling, health checks, Docker |
| EPIS2-02+ | No iniciadas |

## Documentación esencial

| Documento | Propósito |
|-----------|-----------|
| [docs/PRODUCT_CANON.md](docs/PRODUCT_CANON.md) | Visión y principios no negociables |
| [docs/SCOPE_V1.md](docs/SCOPE_V1.md) | MVP v1 limitado |
| [docs/NON_GOALS.md](docs/NON_GOALS.md) | Lo que EPIS2 no hará en v1 |
| [docs/ARCHITECTURE_TARGET.md](docs/ARCHITECTURE_TARGET.md) | Arquitectura objetivo |
| [docs/LEGACY_DONOR_MAP.md](docs/LEGACY_DONOR_MAP.md) | Migración selectiva desde EPIS |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Fases EPIS2-00 … EPIS2-11 |
| [reports/epis2-00-foundation-and-migration-plan.md](reports/epis2-00-foundation-and-migration-plan.md) | Informe de esta fase |

## Repositorio donante

EPIS (`../Epis`) queda en estado **`LEGACY_REFERENCE`**. No copiar su arquitectura ni dependencias aquí.

## Desarrollo local

```bash
npm install
npm run check
npm run test
npm run db:validate
docker compose up -d   # PostgreSQL + Ollama
npm run dev:api        # puerto 3001
npm run dev:web        # puerto 5173
npm run dev:ai         # puerto 3002
```

## Próximo paso

Ejecutar **EPIS2-02 — Sistema visual y shell** (Material UI, login, Centro de Comando).
