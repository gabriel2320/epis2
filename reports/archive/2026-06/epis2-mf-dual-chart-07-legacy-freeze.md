# MF-DUAL-CHART-07 — Legacy freeze

**Estado:** DONE · **Gate:** `quality:dual-chart-legacy-freeze-gate` · **Fecha:** 2026-06-10

## Entrega

- Banner deprecación en `EpisModeSwitcher` (classic/dashboard)
- `classicModeToDualChartSearch()` en `clinicalNavigate.ts` — `?mode=classic` → `chartMode=traditional`
- `quality:three-modes-gate` intacto

## Gates

```bash
npm run quality:dual-chart-legacy-freeze-gate
npm run check
```

## Próximo paso

MF-DUAL-CHART-08 — census-first.
