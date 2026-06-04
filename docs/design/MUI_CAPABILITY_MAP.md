# EPIS2 — Mapa de capacidades Material UI y MUI X

**Fase:** EPIS2-MUI-00 · **Estado:** planificación (sin instalación de paquetes nuevos en esta fase)

**Frase guía:** EPIS2 utiliza todo el poder de MUI, pero solo muestra lo que el trabajo clínico necesita.

---

## Leyenda de clasificación

| Etiqueta | Significado |
|--------|-------------|
| `USE_NOW` | Necesario para el producto actual o la siguiente microfase inmediata (MUI-01–03). |
| `USE_V0` | Ya usado en código MVP; se mantiene y se migrará a `packages/epis2-ui`. |
| `USE_LATER` | Caso clínico identificado; se activa en fase MUI-X indicada. |
| `EVALUATE` | Requiere spike, licencia o modelo de datos antes de adoptar. |
| `REJECT` | No aplica a EPIS2 o contradice invariantes de producto. |

---

## Paquetes npm

| Paquete | Clasificación | Fase de adopción | Caso EPIS2 |
|---------|---------------|------------------|------------|
| `@mui/material` | `USE_V0` → `USE_NOW` | MUI-01 | Único design system visual; ya en `apps/web` y `@epis2/design-system`. |
| `@emotion/react` | `USE_V0` | MUI-01 | Motor de estilos MUI v6. |
| `@emotion/styled` | `USE_NOW` | MUI-01 | Estilos compuestos en wrappers `epis2-ui`. |
| `@mui/icons-material` | `USE_V0` | MUI-01 | Iconografía navegación y clínica; imports por icono. |
| `@mui/x-data-grid` | `USE_LATER` | MUI-05 | Worklists, órdenes, lab, MAR, auditoría, modo tablero. |
| `@mui/x-date-pickers` + `dayjs` | `USE_LATER` | MUI-06 | Fechas de encuentro, órdenes programadas, citas. |
| `@mui/x-charts` | `USE_LATER` | MUI-07 | Tendencias lab, signos vitales, KPIs de servicio. |
| `@mui/x-tree-view` | `USE_LATER` | MUI-08 | Árbol documental, jerarquía longitudinal, DX. |
| `@mui/x-scheduler` | `EVALUATE` | MUI-10 | Agenda y recursos; solo con modelo de citas/eventos. |
| Carbon / OpenMRS UI | `REJECT` | — | Invariante #4 producto. |
| Segundo tema paralelo | `REJECT` | — | Un solo `epis2Theme`. |
| `@mui/lab` (Timeline experimental) | `EVALUATE` | post-MUI-08 | Timeline clínico; preferir `List` + `Accordion` hasta validar UX. |

---

## Material UI Core — por componente

### Layout y estructura

| Componente MUI | Clasificación | Función EPIS2 | Wrapper objetivo |
|----------------|---------------|---------------|------------------|
| `Box` | `USE_V0` | Layout flex en Command Center, dashboards | Uso interno en `epis2-ui`; no exportar |
| `Stack` | `USE_V0` | Agrupación vertical/horizontal | Idem |
| `Grid` / `Grid2` | `USE_LATER` | Modo tablero responsive multi-columna | `EpisPage`, `EpisDashboardShell` |
| `Container` | `USE_LATER` | Páginas de configuración | `EpisPage` |
| `Paper` | `USE_V0` | Login, tarjetas clínicas | `EpisCard` |
| `Divider` | `USE_V0` | Separación secciones | Primitivo interno |

### Navegación

| Componente | Clasificación | Función EPIS2 | Wrapper |
|------------|---------------|---------------|---------|
| `AppBar` | `USE_LATER` | Barra superior clínica unificada | `EpisClinicalPage` |
| `Tabs` / `Tab` | `USE_V0` | Modo tablero (work/patient/service/quality) | `EpisDashboardShell` |
| `Breadcrumbs` | `USE_LATER` | Ficha paciente (opcional) | `EpisClinicalPage` |
| `Drawer` | `USE_LATER` | Panel lateral documentos | `EpisSection` |
| `Menu` / `MenuItem` | `USE_LATER` | Acciones contextuales grid | `EpisDataGrid` toolbar |

### Entrada y formularios

| Componente | Clasificación | Función EPIS2 | Wrapper |
|------------|---------------|---------------|---------|
| `TextField` | `USE_V0` | Power Bar, login, formularios | `EpisTextField` |
| `Button` | `USE_V0` | Acciones primarias | `EpisButton` |
| `IconButton` | `USE_V0` | Acciones compactas | `EpisIconButton` |
| `Select` / `MenuItem` | `USE_V0` | Campos enumerados clínicos | `EpisSelect` |
| `Autocomplete` | `USE_NOW` | Power Bar, búsqueda paciente | `EpisAutocomplete` |
| `Checkbox` / `Radio` / `Switch` | `USE_LATER` | Configuración, consentimientos | `EpisClinicalField` |
| `FormControl` / `FormLabel` | `USE_V0` | Accesibilidad formularios | `EpisClinicalField` |
| `InputAdornment` | `USE_V0` | Iconos en Power Bar | Interno en `EpisCommandBar` |
| `Stepper` | `USE_LATER` | Formularios multi-paso largos | `EpisClinicalForm` |
| `Accordion` | `USE_LATER` | Secciones colapsables ficha | `EpisClinicalSection` |

### Feedback

| Componente | Clasificación | Función EPIS2 | Wrapper |
|------------|---------------|---------------|---------|
| `Alert` | `USE_V0` | CDS, errores comando, IA | `EpisAlert`, `EpisSafetyBanner` |
| `Snackbar` | `USE_LATER` | Confirmaciones no bloqueantes | `EpisSnackbar` |
| `Dialog` | `USE_V0` | Aprobación humana, confirmaciones | `EpisDialog`, `EpisApprovalGate` |
| `CircularProgress` / `Skeleton` | `USE_V0` | Carga | `EpisLoadingState` |
| `Chip` | `USE_V0` | Borrador, rol, IA, sugerencias | `EpisChip` |
| `Tooltip` | `USE_LATER` | Ayuda campo sin saturar UI | `EpisClinicalField` |

### Datos simples (sin MUI X)

| Componente | Clasificación | Función EPIS2 | Wrapper |
|------------|---------------|---------------|---------|
| `Table` / `TableBody`… | `USE_V0` | Listas pequeñas demo | Migrar tablas densas a Data Grid en MUI-05 |
| `List` / `ListItem` | `USE_V0` | Timeline, tareas demo | `EpisTaskList` |
| `Typography` | `USE_V0` | Jerarquía texto | Tokens tema; no wrapper obligatorio |
| `Link` | `USE_LATER` | Enlaces secundarios | Primitivo |

### Otros Core

| Componente | Clasificación | Función EPIS2 | Notas |
|------------|---------------|---------------|-------|
| `CssBaseline` | `USE_V0` | Reset global | Solo en `Epis2ThemeProvider` / `epis2-ui` |
| `ThemeProvider` | `USE_V0` | Tema único | Raíz app |
| `Popper` | `USE_NOW` | Sugerencias comando | `EpisCommandSuggestions` |
| `Card` / `CardContent` | `USE_LATER` | KPIs tablero | `EpisCard` |
| `Rating` | `REJECT` | No clínico | — |
| `SpeedDial` | `REJECT` | Compite con Command Center | — |
| `BottomNavigation` | `REJECT` | Patrón app consumidor; no hospitalario command-first | — |

---

## MUI X — por producto

### Data Grid (`@mui/x-data-grid`)

| Capacidad | Clasificación | Caso EPIS2 | Edición |
|-----------|---------------|------------|---------|
| Columnas, orden, paginación | `USE_LATER` | Lista pacientes, worklist | Community |
| Filtro rápido | `USE_LATER` | Tablero trabajo | Community |
| Selección fila | `USE_LATER` | Abrir ficha desde grid | Community |
| Edición en celda | `EVALUATE` | MAR masivo | Pro — ver licencias |
| Agrupación / pivot | `EVALUATE` | Auditoría avanzada | Premium |
| Export CSV | `USE_LATER` | Calidad / interop demo | Community / Pro según feature |

### Date and Time Pickers

| Capacidad | Clasificación | Caso EPIS2 |
|-----------|---------------|------------|
| `DatePicker` | `USE_LATER` | Fecha encuentro, órdenes |
| `DateTimePicker` | `USE_LATER` | Procedimientos, administración MAR |
| `DateRangePicker` | `EVALUATE` | Filtros tablero |
| Adapter `dayjs` | `USE_LATER` | Locale `es` |

### Charts

| Capacidad | Clasificación | Caso EPIS2 |
|-----------|---------------|------------|
| `LineChart` | `USE_LATER` | Tendencias lab, signos vitales |
| `BarChart` | `USE_LATER` | Indicadores servicio |
| `PieChart` | `EVALUATE` | Distribución diagnósticos demo |
| Sparklines en grid | `EVALUATE` | Post Data Grid + Charts |

### Tree View

| Capacidad | Clasificación | Caso EPIS2 |
|-----------|---------------|------------|
| Árbol expandible | `USE_LATER` | Documentos, secciones longitudinal |
| Selección multi | `EVALUATE` | Clasificación DX |

### Scheduler

| Capacidad | Clasificación | Caso EPIS2 |
|-----------|---------------|------------|
| Vista calendario | `EVALUATE` | Citas (sin modelo V1–V5) |
| Timeline recursos | `EVALUATE` | Quirófano / camas programables |
| Dependencia central | `REJECT` en MUI-00–09 | No instalar como decoración |

---

## Mapa función EPIS2 → componentes (resumen)

| Función EPIS2 | Componentes MUI / X | Fase |
|---------------|---------------------|------|
| Login | `Paper`, `TextField`, `Button`, `Alert` | MUI-03 (`USE_V0`) |
| Power Bar / Centro de Comando | `TextField`, `Chip`, `Button`, `Autocomplete` (MUI-03) | MUI-03 |
| Buscar paciente | `Autocomplete`, luego `DataGrid`, `Dialog` | MUI-03 → MUI-05 |
| Formularios clínicos | `TextField`, `Select`, `Accordion`, `Stepper` | MUI-04 |
| Borradores / aprobación | `Chip`, `Alert`, `Dialog`, `Snackbar` | MUI-03–04 |
| Timeline clínico | `List`, `Accordion`; Timeline `EVALUATE` | MUI-04+ |
| Laboratorio / órdenes | `DataGrid`, `LineChart`, `DatePicker` | MUI-05–07 |
| Medicamentos / MAR | `DataGrid`, `Chip`, `DateTimePicker` | MUI-05–06 |
| Documentos | `TreeView`, `List`, `Dialog` | MUI-08 |
| Modo tablero | `Tabs`, `DataGrid`, `Charts`, `Card` | MUI-09 |
| Agenda | `Scheduler` | MUI-10 `EVALUATE` |
| Configuración | `Tabs`, `Switch`, `FormControl` | post-MVP |

---

## Estado actual del repositorio (línea base MUI-00)

| Aspecto | Estado |
|---------|--------|
| `@mui/material` + icons | Instalados en `apps/web`; tema en `@epis2/design-system` |
| Imports directos `@mui/*` en `apps/web` | **Deuda técnica** — prohibidos tras MUI-01 salvo excepciones documentadas |
| MUI X | No instalado |
| `packages/epis2-ui` | No existe; definido en `EPIS2_UI_ARCHITECTURE.md` |
| Localización `esES` | Pendiente en tema (MUI-01) |

---

## Componentes rechazados (resumen)

- Carbon, OpenMRS, Ant Design, Chakra como DS principal.
- Dashboard como home.
- Menú hospitalario tipo HIS como navegación primaria.
- Instalación masiva de iconos (`import * from '@mui/icons-material'`).
- MUI X Pro/Premium sin entrada en `MUI_LICENSING_DECISION_LOG.md`.
- Scheduler sin modelo de citas/recursos.
- Componentes sin estados loading / error / empty.

---

## Referencias

- `docs/design/EPIS2_UI_ARCHITECTURE.md`
- `docs/design/MUI_X_ADOPTION_PLAN.md`
- `docs/quality/MUI_ANTI_DRIFT_GATES.md`
- Documentación oficial MUI: Material UI, MUI X, minimización de bundle, localización.
