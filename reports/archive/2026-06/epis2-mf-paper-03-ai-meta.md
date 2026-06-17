# MF-PAPER-03 — Metadatos IA + validación firma

**Estado:** DONE · **Gate:** `quality:paper-mode-ai-meta-gate` · **Fecha:** 2026-06-11

## Entrega

### Schema v2 (`packages/clinical-forms/paper-chart/`)
- `PaperFieldState` — `{ value, source, confirmed }`
- Parse **backward-compatible** (string legacy → human/confirmed)
- `applyPaperChartSectionPatch` — humano / `ai_draft` / confirmación
- `canSignPaperChart` · `paperChartSignBlockMessage`
- `insertAiSuggestion` · `confirmAiSuggestion` · `rejectAiSuggestion`

### API
- `patchPaperChartSection` acepta patch completo con `source`/`confirmed`
- Audit metadata en `section_updated`

### Web
- `usePaperChartDraft` — `fields`, `canSign`, `confirmSection`, `applyAiDraft`, `unconfirmedAiCount`
- `PaperChartTemplate` — subrayado IA + botón confirmar (no print)
- `PaperChartMode` — bloqueo firma toolbar + mensaje error

## Gates

```bash
npm run quality:paper-mode-ai-meta-gate   # OK
npm run check                             # OK
npx vitest run packages/clinical-forms/src/paper-chart/
```

## Próximo paso

**MF-PAPER-05** — conectar firma a `approveDraft` · **MF-PAPER-04** — navigator I–VII
