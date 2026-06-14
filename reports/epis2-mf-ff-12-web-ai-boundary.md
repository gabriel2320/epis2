# MF-FF-12 — web sin @epis2/local-ai

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 4  
**Gate:** `quality:web-ai-boundary-gate` ✓ · `quality:clinical-ai-text-safety-gate` (heredado)

---

## Alcance

`apps/web` no importa `@epis2/local-ai`; toda assist pasa por `@epis2/ai-client` + API.

## Cambios

| Artefacto | Entrega |
|-----------|---------|
| `apps/web/package.json` | Dep `@epis2/ai-client`; sin `@epis2/local-ai` |
| `useClinicalCommandSubmit.ts` | Imports ai-client |
| `useGeneratedFormAiAssist.ts` | Imports ai-client |
| `EpisClinicalContextPane.tsx` | Imports ai-client |
| `services/local-ai/` | Re-export desde ai-client (runtime server-side) |
| `validate-web-ai-boundary-gate.mjs` | Scan prohibición local-ai en web/src |

## Próximo paso

**MF-FF-13** — IA asistiva + degraded E2E.
