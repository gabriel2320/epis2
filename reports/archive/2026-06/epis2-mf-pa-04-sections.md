# MF-PA-04 — Secciones papel VIII–XIV scaffold

**Estado:** DONE · **Gate:** `quality:paper-mode-nav-gate` · **Fecha:** 2026-06-11

## Entregables

- `PAPER_CHART_SECTIONS_VIII_XIV` en `@epis2/clinical-forms`
- `paperSectionChrome.tsx` — subestructuras tablas/campos para enfermería…trabajo social
- `paperSectionScaffold.ts` — `resolvePaperSectionMinRows` (VIII–XIV con más filas)
- Navigator I–XIV + paginación usa minRows por sección

## Verificación

```bash
npm run quality:paper-mode-nav-gate
npm run quality:paper-chart-section-tree-gate
npx vitest run packages/clinical-forms/src/paper-chart/paperSectionBatch.test.ts
```

## Próximo

**MF-PA-05** — mirror classic↔paper SoT reconciliado.
