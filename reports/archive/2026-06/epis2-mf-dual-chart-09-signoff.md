# MF-DUAL-CHART-09 — Signoff clínico

**Estado:** DONE · **Gate:** `quality:dual-chart-launcher-gate` · **Fecha:** 2026-06-10

## Entrega

- ADR-002 → **Aceptado**
- `PRODUCT_INVARIANTS.md` #6 enmienda: home = censo; workspace = ficha dual
- `EPIS2_DUAL_CHART_CLINICAL_SIGNOFF.md`
- `CommandLauncherSlim` — launcher delgado en Command Center

## Gates

```bash
npm run quality:dual-chart-launcher-gate
npm run quality:dual-chart-ledger
npm run check
```

## Cierre programa

PROG-DUAL-CHART MF-00…09 **DONE**. Flag `VITE_ENABLE_DUAL_CHART_MODES` para preview progresivo.
