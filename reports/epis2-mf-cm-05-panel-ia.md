# MF-CM-05 — Panel IA: resumen paciente + acciones sugeridas

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Gate:** `quality:cm-05-panel-ia-gate`

## Entregables

| Componente | Cambio |
|------------|--------|
| `contextPanelSuggestions.ts` | Sugerencias determinísticas por rol, alertas, borradores y sección nav |
| `EpisClinicalContextAiSection` | Resumen periodo + chips de comando en panel lateral |
| `ClinicalRightContextPanel` | Chip estado IA local (Ollama) vía meta context |

## Comportamiento

- Resumen bajo demanda (`EpisClinicalPeriodSummary`) con disclosure IA
- Acciones sugeridas ejecutan `useClinicalCommandSubmit` — mismo pipeline que barra NL
- Contexto CE-1 (alertas, borradores, `ehrSection`) prioriza sugerencias

## Verificación

```bash
npm run quality:cm-05-panel-ia-gate
```

## Próximo

**MF-CM-06** — assist borrador invocable desde barra (`ai:evals:live`).
