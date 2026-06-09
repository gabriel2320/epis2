# EPIS2 — Housekeeping estructural del árbol (mini-sesión)

**Fecha:** 2026-06-09 · **Alcance:** hallazgos #6, #3 y #1 del análisis estructural del árbol (sin tocar dominio clínico ni SoT)

## Cambios

### #6 — Carpetas versionadas `v4/` y `v5/` eliminadas

| Antes | Después |
|---|---|
| `apps/api/src/v4/v4.integration.test.ts` | `apps/api/src/interop/v4.integration.test.ts` |
| `apps/api/src/v5/v5.integration.test.ts` | `apps/api/src/ai/v5.integration.test.ts` |

Cada carpeta contenía un solo test de integración; los tests viven ahora junto al módulo que prueban (interop HL7/FHIR/dashboard RBAC → `interop/`; IA trazable → `ai/`). Rutas actualizadas en `INTEGRATION_TEST_SUITES` (`@epis2/test-fixtures`).

### #3 — Distinción `tests/` vs `e2e/` declarada (no se movieron archivos)

**Decisión revisada con evidencia:** los specs de `tests/` son **vitest** (contratos de journey de producto), no Playwright. Moverlos a `e2e/golden/` los rompería: `vitest.config.ts` excluye `e2e/**` y Playwright (testDir `e2e`) intentaría ejecutarlos. En su lugar:

- `tests/README.md` nuevo — declara propósito (golden journey vitest) y prohíbe specs ajenos al journey.
- `docs/INDEX.md` §L4 — nota sobre los tres hogares de pruebas (tests/ · e2e/ · co-localizados).

### #1 — Gate anti-sueltos en `components/`

- Nuevo validador `scripts/architecture/web-components-root-frozen.mjs`, cableado en `architecture:validate`.
- Congela la raíz de `apps/web/src/components` con allowlist de los 57 archivos actuales; cualquier archivo suelto nuevo falla el gate (smoke negativo verificado).
- La lista **solo decrece**: al mover un componente a su subcarpeta de dominio, retirarlo de la allowlist.

## Gates

| Gate | Resultado |
|---|---|
| `npm run check` (lint + typecheck + architecture:validate, 19 validadores) | ✓ |
| `vitest run` v4 + v5 movidos (con `DATABASE_URL`) | ✓ 5/5 |
| `validate-ci-test-parity` (13 suites existen) | ✓ |
| `quality:golden-journey` | ✓ (verificación post-cambio de fixtures) |

## Riesgos

- Bajo. Movimientos `git mv` sin cambio de contenido; el gate nuevo es aditivo y solo restringe crecimiento futuro.
- El primer lote de migración interna (`CommandCenter*` → `components/command-center/`) queda como trabajo oportunista — no bloqueado por el gate.

## Próximo paso exacto

Hallazgo #2 (consolidar 3 modos repartidos en 6 carpetas bajo `src/modes/<modo>/`) — sesión propia con `quality:three-modes-gate` como red.
