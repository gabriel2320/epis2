# MF-SH-02 — Evals por intent top-10

**Programa:** PROG-STRENGTHEN-2026 / PROG-CORE-HARDEN  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:sh-02-intent-evals-gate` · `npm run ai:evals:live`

## Alcance

- Fixture `COMMAND_INTENT_TOP10` (10 intents × 3 frases)
- Runner dedicado MF-SH-02
- Evals assist live (4 blueprints default) con Ollama + `dev:ai`

## Evidencia

| Check | Resultado |
|-------|-----------|
| `ai:evals:intent-top10` | ✓ 28/30 (93.3%) ≥ 90% |
| `command-intent-top10.test.ts` | ✓ 2/2 |
| `ai:evals:command` (suite ampliada) | ✓ 98.6% COMMAND_PHRASE_SUITE |
| `ai:evals:live` | ✓ 4/4 · p95 10931ms |
| Reporte JSON | `reports/ai-evals-intent-top10-latest.json` |
| Reporte live | `reports/ai-evals-live-latest.json` |

## Comandos

```bash
npm run dev:ai          # terminal 1
npm run ai:evals:intent-top10
npm run ai:evals:live
npm run quality:sh-02-intent-evals-gate
```

## Próximo paso

**MF-SH-03** — degradación IA (Ollama down) · `npm run quality:strengthen-next`.
