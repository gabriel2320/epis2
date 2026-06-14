# MF-IM-05 — AI Provenance interno (contracts)

**Programa:** PROG-STRENGTHEN · PROG-IA-MODERNIZE  
**Fecha:** 2026-06-14  
**Gate:** `npm run check`

## Alcance

| Entrega | Detalle |
|---------|---------|
| Contrato | `AiProvenanceRecord` en `packages/contracts/src/ai-provenance.ts` |
| Builder | `buildAiProvenanceRecord()` puro en `apps/api/src/clinical/aiProvenance.ts` |
| Approve | `approveDraft` consulta `ai_runs` y adjunta `aiProvenance` al audit payload |
| Tests | `aiProvenance.test.ts` — citas, omit, mismatch, citas malformadas |

## Campos `AiProvenanceRecord`

- `aiRunId`, `blueprintId`, `model`, `promptHash`
- `documentCitations?` — propagadas desde `ai_runs.output_payload` (MF-IM-04)

## Evidencia

| Check | Resultado |
|-------|-----------|
| `npm run check` | ✓ lint + typecheck + architecture:validate |
| `aiProvenance.test.ts` | ✓ 4 casos unitarios |

## Próximo paso

**MF-IM-06** — Export FHIR Provenance + AIAST (`quality:ai-provenance-gate`).
