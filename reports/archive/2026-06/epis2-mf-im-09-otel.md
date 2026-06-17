# MF-IM-09 — OTel spans pipeline IA

**Programa:** PROG-STRENGTHEN · PROG-IA-MODERNIZE · fase 9  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:ai-otel-gate`

## Alcance

| Entrega | Detalle |
|---------|---------|
| Span `ai.run` | Tracer `epis2-ai` en ruta `POST /api/ai/assist/draft` |
| Atributos | `blueprintId`, `model`, `latencyMs`, `provider` (si disponible) |
| SDK | Extiende MF-NORM-203 (`startOtel`) — sin duplicar init |
| Trace smoke | Unit + integración con `InMemorySpanExporter` |

## Archivos

- `apps/api/src/ai/tracing.ts` — helper `withAiRunSpan`
- `apps/api/src/ai/routes.ts` — wiring assist draft
- `apps/api/src/ai/tracing.test.ts` — unit span attributes
- `apps/api/src/otel.test.ts` — smoke HTTP + `ai.run` con OTEL activo
- `scripts/quality/validate-ai-otel-gate.mjs` — gate CI/dev

## Comandos

```bash
npx vitest run apps/api/src/ai/tracing.test.ts apps/api/src/ai/routes.test.ts apps/api/src/otel.test.ts
npm run quality:ai-otel-gate
npm run check
```

## Próximo paso

Ledger STRENGTHEN: revisar MF-CU-01 / MF-IC-01 según tablero.
