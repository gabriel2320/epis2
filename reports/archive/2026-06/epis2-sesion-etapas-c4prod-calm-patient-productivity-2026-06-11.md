# EPIS2 — Sesión C-4 prod · UX-CALM-PATIENT · productivity dual

**Fecha:** 2026-06-11 · **3 etapas secuenciales**

## Etapa 1 — C-4 prod runbook

| Ítem | Estado |
|------|--------|
| `docs/ops/EPIS2_DUAL_CHART_PROD_ROLLOUT.md` | ✓ |
| `.env.production.example` con dual flag | ✓ |
| Rollback documentado | ✓ |

## Etapa 2 — UX-CALM-PATIENT

| Ítem | Estado |
|------|--------|
| `EpisClassicMd3PatientHeader` sticky + tonal | ✓ |
| Supporting pane 300–380px | ✓ |
| Iconos tarjetas resumen (`clinicalSummaryCardIcons`) | ✓ |
| Grid span 2: timeline + primer lab (calm) | ✓ |
| Chips banner tonal | ✓ |

## Etapa 3 — Productivity ficha dual

| Ítem | Estado |
|------|--------|
| E2E `i)` paleta `epis2-clinical-command-palette` en `/espacio/ficha` | ✓ |
| `CommandPaletteOverlay` + `buildClinicalCommandPaletteItems` ya en `ClinicalShell` | ✓ |

## Gates

```bash
npm run check
VITE_ENABLE_DUAL_CHART_MODES=true npm run test:e2e:dual-chart
```

## Próximo paso

1. Despliegue prod con runbook (operador)
2. UX-CALM-COMMAND — barra premium 28–32px (fuera EMR traditional)
3. C-1 revisión humana opcional M3
