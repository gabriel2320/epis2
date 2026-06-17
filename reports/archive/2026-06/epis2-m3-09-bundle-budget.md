# EPIS2 M3-09 — Bundle budget

**Fecha:** 2026-06-05 · **Comando:** `npm run qa:bundle-analyze`

---

## Chunks principales (gzip)

| Archivo | gzip KB | raw KB |
|---------|---------|--------|
| `index-*.js` (app entry) | 110.6 | 354.8 |
| `mui-core-*.js` (+ date pickers) | 163.9 | 545.0 |
| `mui-x-grid-*.js` | 98.3 | 326.1 |
| `mui-x-scheduler-*.js` | 77.7 | 295.0 |
| `mui-x-charts-*.js` | 60.7 | 179.4 |
| `mui-x-other-*.js` (tree-view) | 11.9 | 38.4 |
| `UiCatalogPage-*.js` (dev lazy) | 3.3 | 9.7 |
| `EpisDataGridCore-*.js` (lazy) | 0.7 | 1.3 |
| `EpisTrendChartCore-*.js` (lazy) | 0.6 | 1.1 |
| `EpisTreeViewCore-*.js` (lazy) | 0.4 | 0.7 |

---

## Presupuestos

| Familia | gzip medido | Límite | Resultado |
|---------|-------------|--------|-----------|
| Data Grid | 98.3 KB | 150 KB | OK |
| Charts | 60.7 KB | 120 KB | OK |
| Tree (mui-x-other) | 11.9 KB | 100 KB | OK |
| Scheduler (dev) | 77.7 KB | 200 KB | OK |

---

## Lazy barrels MUI X

- Barrel principal `@epis2/epis2-ui` exporta solo `*Suspense` + tipos (sin core síncrono).
- Subpaths `@epis2/epis2-ui/data|charts|tree` reservados para tests unitarios en `epis2-ui`.
- `/dev/ui-catalog` lazy-loaded; sin warnings Vite static+dynamic en build.

---

## Regenerar

```bash
npm run qa:bundle-analyze
```

Abrir `apps/web/dist/bundle-stats.html` para treemap interactivo.
