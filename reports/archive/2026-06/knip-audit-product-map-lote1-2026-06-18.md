# Knip lote 1 — MF-KNIP-05-B (design-agents safe)

**Fecha:** 2026-06-18 · **Baseline:** `reports/knip-audit-product-map-baseline-2026-06-18.md` (exports=116)

## Exports retirados (8 ≤ 10)

| Export | Archivo | Motivo |
|--------|---------|--------|
| `dashboardWorkflowAgent` | `dashboardDesignAgents.ts` | Sin callers; labs off |
| `dashboardDensityAgent` | `dashboardDesignAgents.ts` | Sin callers |
| `dashboardSafetyAgent` | `dashboardDesignAgents.ts` | Sin callers |
| `dashboardDataQualityAgent` | `dashboardDesignAgents.ts` | Sin callers |
| `dashboardAccessibilityAgent` | `dashboardDesignAgents.ts` | Sin callers |
| `dashboardScreenshotCriticAgent` | `dashboardDesignAgents.ts` | Sin callers |
| `dashboardPatchPlannerAgent` | `dashboardDesignAgents.ts` | Sin callers |
| `countMatches` | `designScreenContext.ts` | Helper huérfano |

## Conservado

- `dashboardMd3CriticAgent` — test `EpisDashboardMd3Shell.test.tsx`
- `schemas.ts` — gates `design-agent-schemas`, `dashboard-design-agents`, three-modes
- `includesAny` — `commandCenterAgent.ts`

## Reglas respetadas

```txt
Zona safe (design-agents post KNIP-02-A).
Sin tocar contracts / command-registry / clinical-forms.
KNIP-04 metrics = 0.
Lote ≤ 10 exports.
```

## Verificar

```bash
node scripts/quality/validate-knip-05-b-gate.mjs
npm run quality:fast
```
