# MF-PAPER-02 — Campos papel nativos

**Estado:** DONE · **Gate:** `quality:paper-mode-fields-gate` · **Fecha:** 2026-06-11

## Entrega

- **`PaperTextarea`** — `<textarea>` Courier, grilla basal, sin outline MUI; soporte `aiDraft`
- **`PaperSection`** — título institucional I–VII
- **`PaperFieldRow`** — grid label/valor en carátula (paciente + ficha)
- **`PaperChartTemplate`** — reemplaza `EpisTextField` / `EpisM3Text` por componentes papel

## Gates

```bash
npm run quality:paper-mode-fields-gate   # OK
npm run check                            # OK
npx vitest run apps/web/src/components/chart/paper/fields/PaperTextarea.test.tsx
npx vitest run apps/web/src/components/chart/paper/PaperChartTemplate.test.tsx
```

## Gaps cerrados

| ID | Estado |
|----|--------|
| G-01 campos apariencia MUI | ✓ |

## Próximo paso

**MF-PAPER-03** — metadatos IA (`source`, `confirmed`) + bloqueo firma.
