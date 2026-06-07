# EPIS2 — MF-TRAMO-C-005 / C-006 Tendencias + Epicrisis urgencias

**Fecha:** 2026-06-07

## Alcance

Cierre microfases Tramo C pendientes: tendencias en bandeja resultados y CTA epicrisis desde tablero urgencias.

## MF-TRAMO-C-005 — Tendencias resultados

| Entregable | Detalle |
|------------|---------|
| UI | `ResultsInboxTrends` — título `copy.results.trendsSection`, gráficos INR/PCR |
| Ruta | `/espacio/resultados` (ya integrado) |
| IDC | **58** Done — nota MF-TRAMO-C-005 (IDC 164 = RAM, no confundir) |
| Gate | `quality:tramo-c-trends-gate` |
| E2E | `e2e/tramo-c-trends.spec.ts` — DEMO-005 INR |

## MF-TRAMO-C-006 — Epicrisis urgencias

| Entregable | Detalle |
|------------|---------|
| API | `emergency.ts` — IDC 110 `active`, `patientId` en cola triaje |
| UI | `EmergencyDashboardTab` — panel alta/epicrisis + CTAs |
| Navegación | Tablero urgencias → `/espacio/epicrisis` |
| IDC | **110** Active — nota MF-TRAMO-C-006 |
| Gate | `quality:tramo-c-epicrisis-gate` |
| E2E | `e2e/tramo-c-emergency.spec.ts` — journey epicrisis |

## Gates ejecutados

```bash
npm run quality:tramo-c-trends-gate
npm run quality:tramo-c-epicrisis-gate
npm run check
npm run test
npm run db:validate
node scripts/product/generate-idc-matrix.mjs
```

## Riesgos

- Epicrisis urgencias usa blueprint `discharge_summary` compartido con hospitalización — no firma automática (invariante OK).
- Tendencias demo limitadas a INR/PCR; IDC 164 (RAM) sigue Planned.

## Próximo paso

MF-TRAMO-C-007+ según `EPIS2_TRAMO_C_PLAN.md` — censo hospitalización, MAR enfermería, signoff Tramo C.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
