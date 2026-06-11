# MF-PA-06 — Calm premium en superficies papel

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Programa:** PROG-FICHA-PAPEL · **Gate:** `quality:paper-mode-fichapapel-reference-gate`

## Alcance

Integrar superficie Calm Premium (`#F7F9FC`, THEME-CALM-01) en chrome y canvas del modo papel, conservando la hoja imprimible FichaPapel (`#fdfcf7`, navy, tipografía institucional).

## Cambios

| Área | Cambio |
|------|--------|
| `paper-visual-reference.ts` | `epis2PaperCalmCanvasSx`, `epis2PaperCalmChromeBarSx` |
| `PaperPageCanvas` | Canvas Calm + `data-epis2-paper-calm-canvas` |
| `PaperDocumentToolbar` | Chrome bar Calm con acento petróleo sutil |
| `EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md` | Tokens y mapa componente actualizados |
| Gate fichapapel | Assert calm canvas + toolbar |

## Verificación

```bash
npm run quality:paper-mode-fichapapel-reference-gate
npm run test -- packages/epis2-ui/src/theme/paper-visual-reference.test.ts
```

## Riesgos

- Print CSS no afectado: calm solo en chrome/no-print.
- `epis2PaperCanvasSx` legacy conservado para referencia histórica.

## Próximo paso

**MF-PA-07** — planner IA (`quality:paper-planner-ai-gate`).
