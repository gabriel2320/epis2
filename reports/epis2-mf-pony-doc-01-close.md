# MF-PONY-DOC-01 — Cierre (inventario + paths canon)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM

## Alcance

Alinear documentación post poda KNIP-02/03 — sin cambios de código producto.

## Archivos tocados

| Archivo | Cambio |
|---------|--------|
| `docs/MODULE_INVENTORY.md` | v1.1 · Knip baseline · sección Ponytail trim · packages lexicon/rules |
| `docs/design/EPIS2_TYPOGRAPHY_AND_AESTHETICS_RULES.md` | Imports → `@epis2/epis2-ui` + `typography-rules.ts` (sin `theme/foundations`) |
| `docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md` | `CLINICAL_CHART_TAB_REGISTRY` / `clinicalChartTabRegistry.ts` |
| `docs/design/EPIS2_CICA_CLASSIC_MASTER_TREE.md` | Nav SoT actualizado |

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run quality:fast` | OK |

## Próximo paso

**MF-PONY-GATE-01** — archive gates tramo cerrado.
