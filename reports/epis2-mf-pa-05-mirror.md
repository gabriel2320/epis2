# MF-PA-05 — Mirror classic↔paper (SoT reconciliado)

**Estado:** DONE · **Fecha:** 2026-06-11

## Entregables

- `mirrorReconcile.ts` — `buildMirrorVariablesFromSummaryFields`, `seedPaperDraftFromMirrorVariables`, `reconcilePaperDraftFromSummaryFields`
- `getPaperChartState` — si `status=empty`, siembra secciones desde `summaryFields` del paciente (`mirrorSeeded: true`)
- Alineado a `PAPER_MIRROR_VARIABLE_KEYS` + `CHART_SECTION_MIRROR_BINDINGS` (NORM-01)
- Tests: `mirrorReconcile.test.ts`

## Alcance MVP

Seed **solo lectura inicial** en borrador vacío; no sobrescribe contenido humano. Sync bidireccional fino → MF-PA-05+ / PROG-PAPER-MIRROR.

## Próximo

**MF-PA-06** — Calm premium en superficies papel.
