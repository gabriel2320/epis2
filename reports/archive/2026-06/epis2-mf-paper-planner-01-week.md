# MF-PAPER-PLANNER-01 — Vista semanal + algoritmos

**Fecha:** 2026-06-11 · **Gate:** `quality:paper-planner-week-gate` ✓

---

## Entrega

- `weekLayout.ts` — `startOfWeek`, `layoutWeekGrid`, máx 4 ítems/día + overflow
- `WeeklyClinicalPage.tsx` — grid 7 columnas estilo papel
- `demoWeekData.ts` — 13 eventos demo (miércoles con 6 → overflow +2)
- Integración en `PaperPlannerShell` (tab Semana)

## Verificación

```bash
npm run quality:paper-planner-week-gate
```

## Siguiente

**MF-PAPER-PLANNER-02** — vista mensual + markers clínicos.
