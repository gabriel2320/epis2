# MF-CON-09 — Fixtures fuera de deps productivas API

**Fecha:** 2026-06-16 · **Rama:** `chore/epis2-consolidation-2-fixtures`

## Entrega

- `@epis2/test-fixtures` → `devDependencies` en `@epis2/api`
- Identificadores sintéticos + `stableSimCaseUuids` → `@epis2/clinical-domain` (SoT producto)
- `devFixturesBridge` — import dinámico solo dev/test; staging/production no cargan fixtures
- Gate `no-test-fixtures-in-prod` en `architecture:validate`
- Dependabot: npm + GitHub Actions + Docker
- Pin `ollama/ollama:0.6.8` (perfil `bundled-ollama`)

## Gates

- `npm run check` ✓
- `no-test-fixtures-in-prod` ✓

## Riesgo

Bajo — sin cambio de flujo clínico; case-intel/local-ai siguen usando fixtures en dev/CI.
