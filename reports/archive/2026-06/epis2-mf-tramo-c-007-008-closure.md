# EPIS2 — MF-TRAMO-C-007/008 Censo + MAR + cierre Tramo C

**Fecha:** 2026-06-07

## Alcance

Completar hub hospitalización: censo servicio, MAR enfermería y cierre técnico Tramo C.

## MF-TRAMO-C-007 — Censo hospitalario

| Entregable | Detalle |
|------------|---------|
| Ficha | CTA `epis2-longitudinal-open-service-census` → tablero servicio |
| UI | `epis2-service-census` + métricas ocupadas/disponibles |
| Gate | `quality:tramo-c-census-gate` |
| E2E | `e2e/tramo-c-admission.spec.ts` |

## MF-TRAMO-C-008 — MAR enfermería

| Entregable | Detalle |
|------------|---------|
| Ficha | CTA `epis2-longitudinal-open-nursing-mar` → tablero enfermería |
| UI | `epis2-nursing-register-mar-*` → `/espacio/mar` |
| IDC | **116** Done |
| Gate | `quality:tramo-c-mar-gate` |
| E2E | `e2e/tramo-c-mar.spec.ts` |

## MF-TRAMO-C-CLOSURE

- Documento `docs/product/EPIS2_TRAMO_C_CLOSURE.md`
- Gate `quality:tramo-c-closure-gate`
- Plan maestro actualizado — Tramo C ✅ técnico

## Gates

```bash
npm run quality:tramo-c-census-gate
npm run quality:tramo-c-mar-gate
npm run quality:tramo-c-closure-gate
npm run check && npm run test && npm run db:validate
node scripts/product/generate-idc-matrix.mjs
```

## Próximo paso

**Tramo D** — UCI según `EPIS2_TRAMO_D_PLAN.md`.

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
