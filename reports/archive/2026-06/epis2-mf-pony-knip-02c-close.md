# MF-KNIP-02-C — Cierre (poda theme foundations + barrel)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM · **Zona:** `packages/epis2-ui/src/theme`

## Alcance

Eliminar re-exports muertos en `theme/foundations/**` y barrel `theme/index.ts` — SoT real en `theme/theme.ts`, `typography-rules.ts`, `breakpoints.ts`, etc.

## Archivos eliminados (8)

| Archivo | Motivo |
|---------|--------|
| `theme/foundations/breakpoints.ts` | Re-export → `../breakpoints.js`, sin callers |
| `theme/foundations/density.ts` | Re-export muerto |
| `theme/foundations/motion.ts` | Re-export → `../motion.js` |
| `theme/foundations/shadows.ts` | Re-export muerto |
| `theme/foundations/spacing.ts` | Re-export muerto |
| `theme/foundations/shape.ts` | Re-export → `../shape.js` |
| `theme/foundations/typography.ts` | Re-export → `../typography.js` + rules |
| `theme/index.ts` | Barrel sin import runtime; package exporta vía `src/index.ts` → `theme/theme.js` |

## Ajustes colaterales

| Archivo | Cambio |
|---------|--------|
| `validate-dual-chart-scaffold-gate.mjs` | Verifica `theme/theme.ts` en lugar de `theme/index.ts` |

## Baseline Knip

| MF | Unused files |
|----|-------------:|
| KNIP-02-B | 11 |
| **KNIP-02-C** | **3** (−8) |

Restantes: `apps/api/src/db.ts` (falso positivo entry), `scripts/qa/run-ux-g02-validation.ts`, `services/local-ai/src/rag/index.ts` — candidatos KNIP-02-D/E/F.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run quality:fast` | OK (typecheck epis2-ui + vitest package) |

## Nota docs

`docs/design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` cita `@epis2/epis2-ui/theme/foundations/typography` — path obsoleto; canon actual: `typography-rules.ts` / barrel `@epis2/epis2-ui`. Alinear en MF-PONY-DOC-01.

## Próximo paso

**MF-KNIP-02-D** — scripts/labs (`run-ux-g02-validation.ts`, `local-ai/rag/index.ts`) o cierre tramo KNIP-02 con reporte consolidado.
