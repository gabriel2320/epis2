# RH-06 — Web fixtures fuera de prod bundle

**Fecha:** 2026-06-16 · **Rama:** `chore/prog-release-hardening-rh06-web-fixtures` · **Programa:** PROG-RELEASE-HARDENING

## Alcance

Desacoplar `apps/web` de imports estáticos `@epis2/test-fixtures` en runtime prod (Vite build).

## Cambios

| Área | Entrega |
|------|---------|
| Bridge | `apps/web/src/fixtures/devFixturesBridge.ts` + `initDevFixtures()` en `main.tsx` (solo DEV) |
| Refactor | 14 call sites → bridge |
| Gate | `no-test-fixtures-in-prod.mjs` escanea `apps/web/src` |
| deps | `@epis2/test-fixtures` → `devDependencies` en web |
| Gobierno | `monorepo-governance` prohíbe `@epis2/test-fixtures` en web |

## Regla

```text
import.meta.env.PROD → getters vacíos; sin dynamic import de test-fixtures
import.meta.env.DEV  → initDevFixtures() antes de render
```

## Gates

```bash
npm run quality:fast
npm run build -w @epis2/web
npm run architecture:validate
```

## Dependencia

Merge preferible tras PR #15 (Node 24 CI), pero PR independiente sobre `master`.

## Próximo paso

Merge PR #15 + PR #16 (RH-06) · promover RH-02/03 a blocking tras baseline
