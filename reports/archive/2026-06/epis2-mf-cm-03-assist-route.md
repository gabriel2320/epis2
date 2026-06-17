# MF-CM-03 — assist-route + hint IA visible en barra

**Fecha:** 2026-06-11 · **Estado:** DONE (técnico)  
**Gate:** `quality:cm-03-assist-route-gate` · Live: `ai:evals:live` con `dev:ai`

## Evidencia

| Requisito | Implementación |
|-----------|----------------|
| `getCommandBarAiHint` cuando dev:ai | `CommandCenterPage` + `PatientWorkspaceCommandPanel` |
| `pickAssistFallback` en clarify | `router.ts` + hint footer `assistClarifyFooterHint` |
| Testids barra | `epis2-command-center-ai-hint`, `epis2-ficha-command-ai-hint` |

## Verificación

```bash
npm run quality:cm-03-assist-route-gate
# Con stack IA:
npm run dev:ai
npm run ai:evals:live
```

## Próximo

**MF-CM-04** — contexto CE-1 enriquecido.
