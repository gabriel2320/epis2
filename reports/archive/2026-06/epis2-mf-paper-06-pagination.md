# MF-PAPER-06 — Motor paginación + footer N/M

**Estado:** DONE · **Gate:** `quality:paper-mode-pagination-gate` ✓

## Alcance

- `paper/pagination/paginatePaperChart.ts` — `estimateBlockLines`, `paginatePaperChart`
- `PaperFooter.tsx` — pie `p. N/M` con reserva firma en discharge
- `PaperChartMode.tsx` — totalPages dinámico según contenido y formato

## Verificación

```bash
npm run quality:paper-mode-pagination-gate
npx vitest run apps/web/src/components/chart/paper/pagination/
npm run check
```

## Próximo paso

MF-PAPER-07 puente documentos A5/Carta.
