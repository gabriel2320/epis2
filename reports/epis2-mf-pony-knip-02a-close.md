# MF-KNIP-02-A — Cierre (poda design-agents delete-safe)

**Fecha:** 2026-06-18 · **Programa:** PROG-PONYTAIL-TRIM · **Zona:** design-agents + barrel `design/index.ts`

## Alcance

Poda delete-safe de agentes Ollama huérfanos (solo referenciados por `design-agents/index.ts`, nunca importado en runtime). Mantener núcleo usado por tests y overlay dev.

## Archivos eliminados (10)

| Archivo | Motivo |
|---------|--------|
| `apps/web/src/design/index.ts` | Barrel sin consumidores — imports directos a subpaths |
| `apps/web/src/design-agents/index.ts` | Barrel + `runDesignAgentsForScreen` sin callers |
| `classicEmrWorkflowAgent.ts` | Solo index.ts |
| `visualDensityAgent.ts` | Solo index.ts |
| `clinicalSafetyUiAgent.ts` | Solo index.ts |
| `accessibilityAgent.ts` | Solo index.ts |
| `screenshotCriticAgent.ts` | Solo index.ts |
| `patchPlannerAgent.ts` | Solo index.ts |
| `threeModesDesignAgents.ts` | Solo index.ts — schemas conservados en `schemas.ts` |
| `scripts/quality/validate-visual-density-agent-gate.mjs` | Gate obsoleto |

## Conservado (tests / overlay / dashboard lab)

- `designAgentsEnv.ts`, `schemas.ts`, `runDesignAgent.ts`, `ollamaDesignClient.ts`
- `md3LayoutCriticAgent.ts`, `commandCenterAgent.ts`, `dashboardDesignAgents.ts`
- `designAgents.test.ts`, `EpisDesignModeProvider.tsx`

## Gates actualizados

| Gate | Cambio |
|------|--------|
| `validate-design-agents-gate.mjs` | Solo md3 + commandCenter |
| `validate-classic-md3-ai-mode-gate.mjs` | Sin patchPlannerAgent |
| `validate-three-modes-design-agents-gate.mjs` | Solo schemas (sin threeModesDesignAgents.ts) |
| `tools/gates/catalog*.json` | Retirado `quality:visual-density-agent-gate` |

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run quality:fast` | OK (eslint, typecheck web, vitest apps/web + scripts, architecture:validate) |

## Riesgos

- Ninguno en CICA/golden journey — agentes estaban off por defecto y sin wiring productivo.
- `schemas.ts` conserva tipos three-modes usados por `episModes.test.ts`.

## Próximo paso

**MF-KNIP-02-B** — barrels legacy web (`command-center/index.ts`, `dashboard-md3/index.ts`, chart/cds/rad) + componentes Epis* huérfanos.
