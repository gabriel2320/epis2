# MF-PA-07 — Comandos IA contextual planner

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Programa:** PROG-FICHA-PAPEL · **Gate:** `quality:paper-planner-ai-gate`

## Alcance

Comandos NL contextuales en superficie agenda papel: registry + boost CE-1 + hints UI clicables.

## Entregables

| Capa | Artefacto |
|------|-----------|
| Registry | `paper-planner-commands.ts` — 3 intents + `paperPlannerIntentBoost` |
| Ranking | `context-rank.ts` boost +16 en `paperSurface=planner` |
| UI | `PaperPlannerCommandHints` + `usePaperPlannerCommands` en `PaperPlannerShell` |
| Resolución | Misma vía `useClinicalCommandSubmit` que barra universal |

## Intents

- `paper_planner_summarize_day` — resumir agenda del día
- `paper_planner_print_agenda` — imprimir agenda
- `paper_planner_review_pending` — revisar pendientes

## Verificación

```bash
npm run quality:paper-planner-ai-gate
```

## Próximo paso

**MF-PA-08** — signoff visual papel competitivo.
