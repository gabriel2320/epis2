# EPIS2 — Plan de adopción MUI X (progresivo)

**Fase:** EPIS2-MUI-00 · **Estado capacidades:** MUI-01…MUI-10 completados · **Experiencia visual:** ver `M3_ADOPTION_PLAN.md`

> **Rebaseline M3 (2026-06-04):** MUI X cubre la **capa técnica** (grids, charts, pickers, tree, scheduler eval). La **experiencia Material 3 Clinical** (color roles, forma, movimiento, adaptación) se gobierna en `EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`. **MUI-11** (bundle/CI) pasa a **M3-09**.

---

## Secuencia de microfases (MUI X — completada salvo mantenimiento)

```text
MUI-00  Capability map + arquitectura          ← actual (solo docs)
MUI-01  Core + tema + epis2-ui skeleton
MUI-02  /dev/ui-catalog
MUI-03  Login + Command Center (wrappers)
MUI-04  Formularios clínicos
MUI-05  @mui/x-data-grid
MUI-06  @mui/x-date-pickers + dayjs
MUI-07  @mui/x-charts
MUI-08  @mui/x-tree-view
MUI-09  Modo tablero consolidado
MUI-10  @mui/x-scheduler (EVALUATE)
MUI-11  Rendimiento, bundle, licencias CI
```

**No avanzar a MUI-01 hasta cerrar gates de MUI-00** (este documento + reporte).

---

## MUI-01 — Core y tema

**Instalar (único bloque permitido en MUI-01):**

```bash
# Ya presentes en apps/web; consolidar en epis2-ui
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

**Entregables:**

- Crear `packages/epis2-ui` con `theme/` según `EPIS2_THEME_SPEC.md`.
- `Epis2ThemeProvider` + `esES`.
- Primitivos: `EpisButton`, `EpisTextField`, `EpisAlert`, `EpisDialog`, `EpisLoadingState`, `EpisEmptyState`.
- Migrar imports MUI de `apps/web` → `@epis2/epis2-ui` (página a página).
- Validador `no-direct-mui-imports` en CI.

**Caso clínico:** ninguno nuevo; refactor visual sin cambio de flujo.

---

## MUI-02 — Catálogo interno

**Sin dependencias nuevas.**

- Ruta `dev/ui-catalog` con todas las variantes de primitivos.
- Documentar tokens color/tipo en pantalla.
- Gate: ruta no accesible en build producción por defecto.

---

## MUI-03 — Login y Centro de Comando

**Sin dependencias nuevas.**

| Pantalla actual | Wrapper objetivo |
|-----------------|------------------|
| `LoginPage` | `EpisTextField`, `EpisButton`, `EpisAlert` |
| `PowerBar` | `EpisCommandBar` |
| `CommandSuggestionChips` | `EpisCommandSuggestions` |
| `CommandCenterPage` | `EpisClinicalPage` layout mínimo |

**Criterio:** journey dorado paso 9 (home = comando) sin regresión visual.

---

## MUI-04 — Formularios clínicos

**Sin MUI X.**

- `GeneratedClinicalFormPage`, `ClinicalFormRenderer`, `DraftReviewPage` → `EpisClinicalForm`, `EpisApprovalGate`, `EpisDraftStatus`.
- `Stepper` / `Accordion` solo si blueprint lo exige.

**Caso clínico:** evolución, epicrisis, nota enfermería, validación farmacia (existentes).

---

## MUI-05 — Data Grid

**Instalar:**

```bash
npm install @mui/x-data-grid
# workspace: epis2-ui (peer en web)
```

**Casos clínicos (uno por PR):**

1. Worklist modo tablero (`DashboardModePage` tab work).
2. Lista pacientes / búsqueda avanzada.
3. Resultados laboratorio demo.
4. Vista auditoría / calidad (solo lectura).

**Wrapper:** `EpisDataGrid` con lazy `React.lazy(() => import(...))` en ruta tablero.

**Community only** en primera entrega: sin row grouping Pro, sin excel export Premium.

---

## MUI-06 — Date and Time Pickers

**Instalar:**

```bash
npm install @mui/x-date-pickers dayjs
```

**Casos:**

- Fecha encuentro en formularios.
- Programación órdenes / procedimientos.
- Filtros rango en tablero (opcional `DateRangePicker` → `EVALUATE`).

**Config:** `LocalizationProvider` + `AdapterDayjs` + locale `es`.

---

## MUI-07 — Charts

**Instalar:**

```bash
npm install @mui/x-charts
```

**Casos:**

- Tendencia labs demo paciente DEMO-005.
- Signos vitales serie temporal.
- KPI servicio (modo tablero tab service).

**Wrapper:** `EpisTrendChart` lazy; altura fija; estado empty si sin puntos.

---

## MUI-08 — Tree View

**Instalar:**

```bash
npm install @mui/x-tree-view
```

**Casos:**

- `DocumentSearchPanel` jerarquía tipos documento.
- Navegación secciones longitudinal (si reemplaza listas planas).

---

## MUI-09 — Modo tablero

**Depende de MUI-05–07.**

- `EpisDashboardShell`: tabs + «Volver al Centro de Comando».
- Componer `EpisWorklistGrid`, `EpisMetric`, charts y cards.
- Lazy load conjunto `dashboard/*` en ruta `/epis2/dashboard`.

---

## MUI-10 — Scheduler

**Instalar solo si:**

- Existe modelo API de citas (`Appointment`, recursos, slots).
- Producto aprueba alcance agenda.
- Entrada en `MUI_LICENSING_DECISION_LOG` para tier Scheduler.

**Spike MUI-10-EVAL:** pantalla aislada `/dev/scheduler-spike`, sin navegación clínica.

---

## MUI-11 — Rendimiento y CI

**Estado:** reencuadrado en **M3-09** (QA, bundle, ESLint licencias).

- Auditoría bundle (`vite build --analyze` o `rollup-plugin-visualizer`).
- Regla ESLint: `no-restricted-imports` para `@mui/material` fuera de `epis2-ui`.
- Lazy routes: dashboard, charts, grid, scheduler subpath.
- Imports de iconos: path por icono (`@mui/icons-material/Search`).
- Documentar tamaño máximo aceptable por chunk (objetivo: grid < 150KB gzip incremental en ruta tablero).

Ver `docs/design/M3_ADOPTION_PLAN.md` § M3-09.

---

## Matriz dependencia → fase

| Paquete | Fase | Bloqueante |
|---------|------|------------|
| `@mui/material` | MUI-01 | — |
| `@mui/icons-material` | MUI-01 | — |
| `@mui/x-data-grid` | MUI-05 | MUI-03 tablero base |
| `@mui/x-date-pickers` | MUI-06 | Formularios con fecha |
| `@mui/x-charts` | MUI-07 | Datos serie en API |
| `@mui/x-tree-view` | MUI-08 | Modelo documentos |
| `@mui/x-scheduler` | MUI-10 | Modelo citas |

---

## Referencias

- `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`
- `docs/design/M3_ADOPTION_PLAN.md`
- `docs/design/MUI_CAPABILITY_MAP.md`
- `docs/design/MUI_LICENSING_DECISION_LOG.md`
- `docs/quality/MUI_ANTI_DRIFT_GATES.md`
