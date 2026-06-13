# MF-SH-01 — Trazabilidad draft→approve→ai_runs

**Programa:** PROG-STRENGTHEN-2026 / PROG-CORE-HARDEN  
**Fecha:** 2026-06-13  
**Gate:** `npm run quality:draft-trace-gate`

## Alcance

- Columna `approvals.ai_run_id` (migración `043_approvals_ai_run.sql`)
- Meta `_epis2AssistTrace` en body de borrador (no copia a nota aprobada)
- `assistAiRunId` opcional en POST/PATCH `/api/drafts`
- Audit `clinical.draft.approved` con `payload.aiRunId` cuando aplica

## Evidencia

| Check | Resultado |
|-------|-----------|
| `quality:draft-trace-gate` | OK |
| Integración `draft-trace.integration.test.ts` | OK |
| P1 `ai:evals:sim` | 13/13 — `reports/ai-evals-sim-2026-06-13.json` |
| Signoff experiencia core | `quality:experiencia-core-signoff-gate` OK |

## Próximo paso

**MF-SH-02** — evals por intent top-10 (`npm run quality:strengthen-next`).
