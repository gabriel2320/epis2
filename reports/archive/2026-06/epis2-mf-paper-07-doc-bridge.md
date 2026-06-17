# MF-PAPER-07 — Puente documentos A5/Carta

**Estado:** DONE · **Gate:** `quality:paper-mode-doc-bridge-gate` ✓

## Alcance

- `paperDocumentBridge.ts` — rutas receta/epicrisis/lab/certificado/imagen + `returnChartMode=paper`
- `PaperDocumentToolbar` — fila `epis2-paper-doc-bridge` con 5 enlaces
- Print pages — botón `epis2-paper-back-to-chart` cuando viene de ficha papel
- Re-export en `clinicalNavigate.ts`

## Verificación

```bash
npm run quality:paper-mode-doc-bridge-gate
npm run check
```

## Próximo paso

MF-PAPER-09 signoff (desbloqueado).
