---
name: epis2-ci
description: >-
  Investigar fallos CI o E2E en EPIS2: leer run de GitHub Actions, localizar spec
  o gate, proponer fix mínimo. Usar cuando CI rojo o usuario pide revisar checks.
---

# EPIS2 — Investigación CI / E2E

## Con GitHub MCP (si activo)

1. Identificar repo `gabriel2320/epis2` y run fallido (Actions).
2. Resumir job/step que falló (check, test, e2e, db:validate, golden-journey).
3. Enlazar run URL al usuario.

Sin GitHub MCP: pedir URL del run o usar `gh run view` si `gh` está autenticado.

## Repro local

| Fallo típico | Comando local |
|--------------|---------------|
| Lint/type/arch | `npm run check` |
| Unit/integration | `npm run test` |
| E2E tramo | `npm run test:e2e:tramo-c-admission` (u otro script en package.json) |
| Paridad CI | `npm run quality:local-ci` |
| DB | `npm run db:validate` |

## Fix

- Diff mínimo alineado al spec E2E o gate que falló.
- No reabrir fixes ya cerrados sin evidencia de regresión.
- Tras fix: mismos gates + reporte en `reports/`.

Referencia reciente: `reports/epis2-ci-e2e-closure-2026-06-09.md`
