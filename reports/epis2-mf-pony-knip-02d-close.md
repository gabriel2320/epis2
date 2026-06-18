# MF-KNIP-02-D — Cierre (tail scripts/labs + knip config)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Cerrar los 3 unused files restantes post KNIP-02-C: poda delete-safe + entrada Knip para script QA activo.

## Archivos eliminados (2)

| Archivo | Motivo |
|---------|--------|
| `apps/api/src/db.ts` | Re-export shim → `db/client.js`; API importa client directo |
| `services/local-ai/src/rag/index.ts` | Barrel sin callers; RAG activo vía subpaths (`assistCitations`, etc.) |

## Conservado

| Archivo | Motivo |
|---------|--------|
| `scripts/qa/run-ux-g02-validation.ts` | Ejecutado por `quality:ux-g02` (catalog) + evidencia `ux-pilot-gate` |

## Ajustes

| Archivo | Cambio |
|---------|--------|
| `knip.json` | Entry `scripts/**/*.ts` — reconoce QA scripts invocados por catalog |
| `validate-rag-retrieval-gate.mjs` | Exige `assembleContext.ts` en lugar de `rag/index.ts` |

## Baseline Knip

| MF | Unused files |
|----|-------------:|
| KNIP-02-C | 3 |
| **KNIP-02-D** | **0** |

## Gates

| Gate | Resultado |
|------|-----------|
| `npx knip --reporter compact` | **0 unused files** (deps/exports pendientes KNIP-03) |
| `architecture:validate` | OK |
| `npm run quality:fast` | api vitest integration 500 (env Postgres — no relacionado con poda) |

## Próximo paso

**MF-PONY-DOC-01** — alinear docs (typography foundations path) · **MF-KNIP-03** — unused deps (`zod` epis2-ui, `@epis2/drug-dictionary-cl`).
