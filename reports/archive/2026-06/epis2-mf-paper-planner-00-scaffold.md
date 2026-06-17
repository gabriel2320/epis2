# MF-PAPER-PLANNER-00 — ADR-003 + scaffold agenda día

**Fecha:** 2026-06-11 · **Programa:** PROG-PAPER-PLANNER · **Gate:** `quality:paper-planner-scaffold-gate` ✓

---

## Alcance

- ADR-003 modo agenda clínica papel
- `DailyClinicalPage` con timeline horario + pendientes (datos demo)
- `PaperPlannerShell` (tabs día/semana/mes; semana/mes placeholder)
- `PaperPlannerSurfaceTabs` Documento | Agenda en `PaperChartMode`
- Search params: `paperSurface`, `plannerView`

## Archivos

| Artefacto | Ruta |
|-----------|------|
| ADR | `docs/adr/ADR-003-paper-planner-mode.md` |
| Planner | `apps/web/src/components/chart/paper/planner/` |
| Integración | `PaperChartMode.tsx`, `chartModeSearch.ts`, `DualChartPatientPage.tsx` |
| Copy | `packages/design-system/src/copy/es.ts` → `paperPlanner` |

## Verificación

```bash
npm run quality:paper-planner-scaffold-gate
npm run typecheck -w @epis2/web
```

## Siguiente

**MF-PAPER-PLANNER-01** — vista semanal + algoritmos de layout (`quality:paper-planner-week-gate`).
