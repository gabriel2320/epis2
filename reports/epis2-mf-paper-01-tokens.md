# MF-PAPER-01 — Tokens + CSS print grilla basal

**Estado:** DONE · **Gate:** `quality:paper-mode-tokens-gate` · **Fecha:** 2026-06-11

## Entrega

- **`epis2PaperChartColors`** — marfil `#fffdf6`, ink, ruled/margin rgba clínico, foldShadow
- **`epis2PaperChartTokens`** — `baselineMmLetter: 6`, `baselineMmA5: 5.5`, dimensiones mm
- **`epis2PaperChartCssVars()`** — inyectado vía `epis2PaperDocumentSx`
- **`paperChartPrint.css`** — grilla 6mm, margen rojo, `.epis2-paper-page`, print oculta shell
- **`PaperChartTemplate`** — clase `epis2-paper-page` + vars desde sx
- **Gate** `quality:paper-mode-tokens-gate` + test `chart-modes-tokens.test.ts`

## Gates

```bash
npm run quality:paper-mode-tokens-gate   # OK
npm run check                          # OK
npx vitest run packages/epis2-ui/src/theme/chart-modes-tokens.test.ts  # 3/3
```

## Gaps cerrados (recon)

| ID | Estado |
|----|--------|
| G-02 tokens marfil / ruled | ✓ |
| G-03 print oculta shell | ✓ (parcial — campos MUI pendiente PM-02) |

## Próximo paso

**MF-PAPER-02** — `PaperFieldRow`, `PaperTextarea` (campos nativos sin borde Material).
