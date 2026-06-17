# EPIS2 — Sesión post M3-09 signoff

**Fecha:** 2026-06-05 · **Alcance:** lazy barrels MUI X + modo oscuro piloto

---

## Entregado

### Lazy barrels MUI X
- Barrel `@epis2/epis2-ui`: solo `EpisDataGridSuspense`, `EpisTrendChartSuspense`, `EpisTreeViewSuspense` + tipos.
- Subpaths `@epis2/epis2-ui/data|charts|tree` para tests unitarios en `epis2-ui`.
- App web migrada a `*Suspense` en grids, árboles y catálogo dev.
- `/dev/ui-catalog` lazy en router (como scheduler spike).
- `vite.config.ts`: date pickers en `mui-core`; tree en `mui-x-other`.
- Build sin warnings static+dynamic; entry ~110.6 KB gzip.

### Modo oscuro
- `EpisThemeModeToggle` en barra del Centro de Comando.
- Chips claro/oscuro en catálogo M3-08.
- Copy `themePreferences.modeLight|modeDark`.
- Tests: `EpisThemeModeToggle.test.tsx`, `create-epis2-theme.dark.test.ts`.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm test` | 172 passed, 10 skipped (182) |
| `npm run db:validate` | OK |
| `npm run qa:bundle-analyze` | OK |

---

## Riesgos

- `mui-core` ~164 KB gzip (incluye date pickers siempre cargados con tema).
- Modo oscuro sin revisión humana extendida en todas las pantallas clínicas.

---

## Próximo paso

Feedback piloto clínico sobre contraste oscuro en formularios y tablero; commit pendiente si git identity no configurada.
