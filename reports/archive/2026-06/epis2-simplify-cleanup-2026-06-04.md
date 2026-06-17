# EPIS2 — Simplificación y limpieza UI

**Fecha:** 2026-06-04  
**Alcance:** Consolidar capa grid RAD, cerrar tab Quality, eliminar duplicación.

---

## Qué se hizo

### 1. Componente canónico `DashboardPanelGridSection`

Unifica el patrón repetido en UCI, Calidad y futuros tabs:
- `EpisWorkspaceSection` + `DashboardHomogeneousGrid` (title/detail)
- Bulk copy vía `radBulkActions.ts`
- Ubicación única: `apps/web/src/components/grids/`

### 2. Tab Calidad migrado (418 → ~280 líneas efectivas)

- Eliminadas **20+ listas** `<ListItem>` duplicadas
- Mapas de filas en `quality/qualityDashboardRowMaps.ts` (lógica pura, testeable)
- Acordeones: auditoría secundaria + IAAS secundaria
- Sentinel + matriz vigilancia visibles; staging/audit unificados en el mismo stack L4→L5
- **Eliminado** `QualityDashboardGrids.tsx` (grid paralelo con `EpisDataGridSuspense`)

### 3. Limpieza estructural

- Eliminada carpeta duplicada `apps/web/src/grids/` (barrel + copy de bulk actions)
- UCI reutiliza `DashboardPanelGridSection` (sin `IcuGridSection` local)
- Registry: `dashboard-quality` → `done`
- Gates: `layers-integration` + `grid-surface` incluyen Quality tab

### 4. Planes actualizados

- `EPIS2_GLOBAL_DEV_PLAN.md` — Fase A visual **cerrada** (salvo Command palette Fase B)
- `EPIS2_UI_LAYERS.md` — helpers y tabla quality actualizados

---

## Gates

| Comando | Resultado |
|---------|-----------|
| `npm run check` | OK |
| `npm run db:validate` | OK |
| `npm run quality:layers-integration-gate` | OK |
| Tests `apps/web/src/components` | 21/21 OK |

`npm run test` completo sigue fallando en integración API sin Postgres `:5433` (preexistente).

---

## Riesgos

1. **Tabs no migrados** (APS, OR, Recepción) aún usan listas — fuera de alcance Fase A dashboard rol.
2. **Pharmacy** `partial` — Tramo J bloqueado.
3. **Command palette global** pendiente Fase B.

---

## Próximo paso

1. `ClinicalCommandPalette` en `EpisAppScaffold` (Ctrl+K).
2. Migración incremental APS/OR solo si entra en sprint de tramo clínico.
3. Tramo J tras pharmacy `done` + UX-G02.

---

## Frase guía

> Un patrón grid, un mapa de filas, cero listas card-like en tabs densos del dashboard.
