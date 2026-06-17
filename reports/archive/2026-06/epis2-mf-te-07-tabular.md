# MF-TE-07 — Densidad tabular órdenes/MAR

**Fecha:** 2026-06-11 · **Estado:** DONE  
**Gate:** `quality:te-07-tabular-gate`

## Entregables

| Componente | Cambio |
|------------|--------|
| `clinicalDenseTabular.ts` | `mapLabelValueRowsToDenseTabular`, `mapMarRowsToDenseTabular` |
| `TraditionalDenseSectionGrid` | `ClinicalDataGrid` compacto (órdenes / MAR) |
| `TraditionalOrdersSection` | Grid denso en lugar de tabla label/value |
| `TraditionalMedsSection` | MAR denso con zona en columna status |

## Verificación

```bash
npm run quality:te-07-tabular-gate
```

## Próximo

**MF-TE-08** — signoff ficha electrónica.
