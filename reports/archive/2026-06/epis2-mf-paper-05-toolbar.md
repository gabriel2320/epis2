# MF-PAPER-05 — Toolbar guardar/firmar/PDF

**Estado:** DONE · **Gate:** `quality:paper-mode-toolbar-gate` ✓

## Alcance

- `PaperDocumentToolbar` — botones guardar/firmar/PDF con estados saving/signing/disabled
- `PaperChartMode` — `saveNow`, `signDraft`, navegación a vista print (PDF)
- API: `GET /paper-chart` con `draftId`, `readOnly`, `status`; `POST /paper-chart/approve`
- `usePaperChartDraft` — flush debounce, firma, read-only post-approve
- `PaperChartPrintPage` — aviso documento firmado

## Verificación

```bash
npm run quality:paper-mode-toolbar-gate
npm run check
```

## Riesgos

- Tras firmar, edición requiere nuevo borrador (upsert crea draft si no hay activo).
- Permiso `draft.approve` obligatorio para firmar.

## Próximo paso

MF-PAPER-06 — motor paginación + footer N/M.
