# EPIS2 — Stack de capas UI (L3 → L5)

**Versión:** 1.0 · **Fecha:** 2026-06-07  
**Relacionado:** `EPIS2_GLOBAL_DEV_PLAN.md` · MF-UI-SIMPLIFY · MF-RAD-M3 · MF-CLINICAL-PRODUCTIVITY

---

## Precedencia (de abajo hacia arriba)

```text
L0 Invariantes + architecture:validate
L1 Producto (olas, golden journey)
L2 Tramos clínicos A–K
L3 UX densidad (MF-UI-SIMPLIFY-M3)
L4 RAD productividad (MF-RAD-M3)
L5 Clinical productivity (@epis2/clinical-productivity)
L6 Tramo J farmacia — scaffold ✓ · grid partial · piloto tras Fase B
L× Modos MD3 — orquestación transversal (Command · Classic · Dashboard); ver EPIS2_MODES_LAYER.md
```

---

## Modos MD3 (transversal L3)

No es una capa de widgets: **orquesta shells** sobre rutas existentes.

| Modo | Shell | Gate |
|------|-------|------|
| Command | `EpisAppScaffold` | `login-command-home-gate` |
| Classic | `EpisClassicMd3Shell` | `classic-md3-mode-gate` |
| Dashboard | `EpisDashboardMd3Shell` | `dashboard-md3-mode-gate` |

Código: `apps/web/src/modes/` · sesión: `EpisSessionContext` · plan: [`EPIS2_THREE_MODES_DEV_PLAN.md`](EPIS2_THREE_MODES_DEV_PLAN.md).

---

## Responsabilidades por capa

| Capa | Paquete / carpeta | Qué hace | Qué NO hace |
|------|-------------------|----------|-------------|
| **L3** | `apps/web` scaffold, `EpisAppScaffold`, gates ui-simplify | Scroll único, ActionBar única, densidad, icon budget | Lógica clínica, firmas |
| **L4** | `apps/web/src/components/rad/*`, `design/radScreenRegistry.ts` | Shell RAD, grids seleccionables, acordeones, bulk operativo | Autocomplete IA, spellcheck |
| **L5** | `packages/clinical-productivity` | `ClinicalDataGrid`, autocomplete, command palette, copy/paste clínico | Aprobar borradores, escribir SoT |

---

## Puente L4 → L5 (patrón canónico)

```text
Pantalla dashboard
  └─ EpisRadDashboardTabShell          (L4 — scroll + testId RAD)
       └─ DashboardHomogeneousGrid     (L4 — bulk + columnas copy)
            └─ EpisRadSelectableGrid   (L4 — selección + EpisBulkActionMenu)
                 └─ ClinicalDataGrid   (L5 — @mui/x-data-grid vía wrapper)
```

**Helpers compartidos:** `apps/web/src/components/grids/`
- `DashboardPanelGridSection` — sección title/detail + bulk copy
- `DashboardHomogeneousGrid` — selección + bulk RAD
- `radBulkActions.ts` — clipboard sin semántica clínica

**Piloto SoT grid clínico:** `PatientListGrid.tsx` importa `ClinicalDataGrid` directamente cuando la pantalla no necesita bulk RAD.

---

## Gates de integración

```bash
npm run quality:layers-integration-gate
```

Sub-gates: `ui-simplify` · `rad-m3-discipline` · `grid-surface` · `form-collapse` · `clinical-productivity`.

---

## Estado migración dashboard (MF-RAD-M3-A)

| Tab | Shell RAD | Grids | Acordeón secundario | Registry |
|-----|-----------|-------|---------------------|----------|
| work | ✓ | WorklistDraftGrid | — | done |
| service | ✓ | census | — | done |
| nursing | ✓ | MAR | — | done |
| pharmacy | ✓ | cola | ✓ | partial (Tramo J) |
| emergency | ✓ | triage | — | done |
| icu | ✓ | camas + monitoreo | ✓ | done |
| specialty | ✓ | partogram/oncology | ✓ | done |
| patient | ✓ | problemas/timeline | — | done |
| quality | ✓ | panel grids + acordeones | ✓ | done |

---

## Frase guía

> RAD decide *cómo se trabaja* (selección, bulk, acordeón). Clinical-productivity decide *con qué widgets* (grid, autocomplete, palette). Ninguna capa firma ni aprueba.
