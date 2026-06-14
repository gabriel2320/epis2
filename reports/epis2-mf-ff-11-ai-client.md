# MF-FF-11 — Package @epis2/ai-client

**Fecha cierre:** 2026-06-15 · **Programa:** PROG-FICHA-FIRST · **Wave:** 4  
**Gate:** `quality:ai-client-gate` ✓ · `architecture:validate` (ai-client-boundary) ✓

---

## Alcance

Extraer cliente HTTP de assist IA a package compartido; web consume vía `@epis2/ai-client` sin acoplar runtime local.

## Cambios

| Artefacto | Entrega |
|-----------|---------|
| `packages/ai-client/` | `http.ts`, `commandAssistDraft.ts`, `contextPanelSuggestions.ts`, `index.ts` |
| `apps/web/src/api/aiApi.ts` | `createAiHttpClient` desde `@epis2/ai-client/http` |
| `scripts/architecture/ai-client-boundary.mjs` | Gate arquitectónico |
| `scripts/quality/validate-ai-client-gate.mjs` | Gate MF-FF-11 |
| Root `package.json` | `@epis2/ai-client` en build/typecheck |

## Próximo paso

**MF-FF-12** — web sin `@epis2/local-ai`.
