# MF-PAPER-08 — Comandos IA paper (command-registry)

**Estado:** DONE · **Gate:** `quality:paper-mode-ai-commands-gate` ✓

## Alcance

- `packages/command-registry/src/paper-commands.ts` — 6 intents contextuales papel
- Integración en `EPIS2_COMMAND_DEFINITIONS` + metadata + routes
- `ClinicalRightContextPanel` — lista borradores IA (`epis2-paper-ai-drafts-panel`)
- Boost ranking `chartMode=paper` en `context-rank.ts`

## Comandos

| Intent | Ejemplo |
|--------|---------|
| `paper_order_soap` | ordenar en soap |
| `paper_summarize_24h` | resumir últimas 24h |
| `paper_prepare_print` | preparar impresión |
| `paper_prepare_discharge_draft` | preparar epicrisis borrador |
| `paper_create_prescription_a5` | crear receta a5 |
| `paper_detect_pending` | detectar pendientes |

## Verificación

```bash
npm run quality:paper-mode-ai-commands-gate
npx vitest run packages/command-registry/src/paper-commands.test.ts
npm run check
```

## Próximo paso

MF-PAPER-09 signoff (requiere MF-PAPER-04, 06, 07, 08).
