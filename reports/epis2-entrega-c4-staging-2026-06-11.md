# EPIS2 — Entrega C-4 — Activación dual chart (staging/local)

**Fecha:** 2026-06-11 · **Hilo:** C · **Alcance:** staging + local (prod explícito pendiente)

## Cambios

| Artefacto | Estado |
|-----------|--------|
| `.env.example` | `VITE_ENABLE_DUAL_CHART_MODES=true` documentado |
| `.env.staging.example` | Flag `true` para pre-piloto |
| CI job `e2e-dual-chart` | Ya activo (sesión E2) |
| `dualChartModesEnv.ts` | DEV default on si flag omitido |

## Verificación

```bash
npm run stack:dev
# .env con VITE_ENABLE_DUAL_CHART_MODES=true
npm run dev -w @epis2/web
# Login → /espacio/ficha?patientId=… → traditional ↔ paper
VITE_ENABLE_DUAL_CHART_MODES=true npm run test:e2e:dual-chart
npm run quality:dual-chart-gate
```

## Prod

**No activado** en este entrega — requiere decisión operador y runbook despliegue.

## Próximo paso

Prod rollout C-4 · extensión `@epis2/clinical-productivity` en ficha dual (backlog plan maestro).
