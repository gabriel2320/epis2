# EPIS2 — Navegación de ficha clínica Material Design 3

> **SUPERSEDED_BY_CICA (2026-06-19):** referencia historica M3. Navegacion activa de paciente: CICA `/app/pacientes/:patientId/*` via registry.

**Versión:** 1.0 · **Fecha:** 2026-06-07
**Home canónica:** CICA (`/app/buscar`) — **no** dashboard
**Implementación:** `packages/epis2-ui/src/clinical/` · `apps/web/src/layouts/`

> Eliminar fatiga de clics, preservar contexto del paciente y mantener flujo command-first sin convertir EPIS2 en expediente hospitalario completo.

---

## Mapa de profundidad (5 niveles)

> **Conciliación 200 ítems:** el rail N0 conmuta **espacios de trabajo por rol** — ver [`EPIS2_ROLE_WORKSPACES_M3.md`](./EPIS2_ROLE_WORKSPACES_M3.md) y matriz IDC [`EPIS2_INVENTORY_WORKSPACE_MATRIX.md`](../product/EPIS2_INVENTORY_WORKSPACE_MATRIX.md).

| Nivel | Patrón MD3 | Componente EPIS2 | Fijo / Scroll |
|-------|------------|------------------|---------------|
| **0** | Navigation Rail | `EpisNavigationRail` + `EpisAppShellLayout` | Rail fijo izquierda; contenido scroll |
| **1** | Top App Bar paciente | `EpisPatientContextBar` | Fijo bajo rail (no desaparece) |
| **2** | Primary Tabs (≤5) | `EpisPatientChartTabs` | Fijo bajo cabecera |
| **3** | Formulario + Scrollspy | `EpisClinicalScrollspyLayout` + `EpisClinicalForm` | Índice sticky lg+; formulario scroll |
| **4** | Extended FAB | `EpisClinicalActionDock` | Fijo esquina inferior derecha |

---

## Árbol de componentes

```text
EpisAppShellLayout                          [N0 — shell global]
├── EpisNavigationRail                      [80dp, md+, sin drawer oculto]
│   ├── Conmutador workspaces (5)           [N0 — EPIS2_ROLE_WORKSPACES_M3.md]
│   ├── ─ divider ─
│   └── Ítems contextuales del workspace activo
└── <main>
    ├── OfflineStatusBanner
    ├── EpisPatientChartShell               [N1–N2 — solo con paciente activo]
    │   ├── EpisPatientContextBar           [nombre, meta, badges críticos]
    │   └── EpisPatientChartTabs            [5 tabs máx.]
    └── <scroll region>
        └── {Outlet / página}
            ├── PatientWorkspacePage        [tab Resumen / Historia]
            └── GeneratedClinicalFormPage
                └── EpisClinicalTwoPaneLayout   [split opcional]
                    ├── EpisClinicalFocusAppBar
                    ├── contextPane | actionPane
                    │   └── EpisClinicalScrollspyLayout [N3]
                    │       ├── EpisClinicalScrollspy
                    │       └── EpisClinicalForm (+ grid 12 cols)
                    ├── EpisClinicalFormFooter [nav secundaria]
                    └── EpisClinicalActionDock [N4 — Guardar borrador]
```

---

## Nivel 0 — Centro de Comando (no dashboard)

**Regla de producto:** La home es el **Centro de Comando** con barra de instrucción clínica. El rail global no reemplaza el comando: lo acerca.

| Destino rail | Ruta EPIS2 | Notas |
|--------------|------------|-------|
| CICA buscar | `/app/buscar` | Home canónica — censo clínico |
| Agenda | `/epis2/dashboard?tab=work` | Modo tablero opcional (Mi trabajo) |
| Pacientes | `/espacio/buscar-paciente` | Alta densidad — `PatientListGrid` |
| Mensajes | — | Placeholder deshabilitado (v1) |
| Ajustes | `/preferencias-apariencia` | Tema + **pantalla dividida** |

**Interacción:** Rail visible ≥ `md` (768px). En compacto, navegación vía comando y chips del Centro de Comando.

---

## Nivel 1 — Contexto inmutable del paciente

`EpisPatientContextBar` — garantía visual de paciente correcto.

| Elemento | Fuente | Regla |
|----------|--------|-------|
| Nombre | `ActivePatientContext` | `titleLarge`, truncado en móvil |
| Meta | edad, sexo, demo case | `bodyMedium`, secundario |
| Badges críticos | CDS / alergias | `error` / `warning` — roles clínicos inmutables |
| Trailing | chips demo, acciones | No compite con nombre |

**Scroll:** La barra **no** hace scroll; vive en `patientChrome` de `EpisAppShellLayout`.

---

## Nivel 2 — Primary Tabs (5 ramas)

| Tab | Rutas EPIS2 | Contenido |
|-----|-------------|-----------|
| Resumen | `/espacio/ficha`, `/espacio/resumen` | Widgets + contexto clínico |
| Historia | `/espacio/ficha` (longitudinal) | Timeline, borradores |
| Consulta | `/espacio/evolucion`, `/ambulatorio`, `/enfermeria` | SOAP / notas |
| Exámenes | `/espacio/resultados`, lab, imagen | Bandeja + órdenes |
| Recetas | `/espacio/receta`, MAR, farmacia | Órdenes medicación |

Config: `apps/web/src/clinical/patientChartNavigation.ts`

---

## Nivel 3 — Formulario clínico (SOAP)

**Layout:** Una sola página con scroll vertical — **sin dialogs** para formularios largos.

| Pieza | Comportamiento |
|-------|----------------|
| `EpisClinicalScrollspy` | Resalta sección activa (`IntersectionObserver`); clic salta a `#epis2-section-{id}` |
| `EpisClinicalForm` | Grid 12 cols; secciones colapsables (`initialVisibility: collapsed`) |
| Two-pane | Panel izquierdo = historial bajo demanda o **pantalla dividida** (preferencia) |

**Preferencia pantalla dividida** (`clinicalSplitScreen`):

| Valor | Comportamiento |
|-------|----------------|
| `focus` | Historial cerrado por defecto (Modo Enfoque) |
| `split` | Historial abierto por defecto en formularios two-pane ≥960px |

Persistencia: `sessionStorage` por paciente+blueprint; override manual del toggle en app bar.

---

## Nivel 4 — Cierre de atención

`EpisClinicalActionDock` — Extended FAB anclado inferior derecho.

| Acción | Jerarquía MD3 |
|--------|---------------|
| Guardar borrador | Extended FAB `primary` |
| Sugerir IA | Tonal secundario (en flujo, no en FAB) |
| Firmar / cerrar | Fase posterior — puerta `EpisApprovalGate` |

Footer two-pane: solo navegación (`ClinicalPageNav`); acción primaria en FAB para evitar duplicidad.

---

## Reglas de interacción (resumen)

```text
FIJO (no scroll)
  Navigation Rail (md+)
  Patient Context Bar
  Primary Tabs
  Extended FAB / Action Dock

SCROLL
  Contenido de tab / formulario
  Panel historial (two-pane izquierda)
  Panel acción (two-pane derecha)

TRANSICIONES
  Split Enfoque ↔ Contexto: 280ms emphasized (reducido si prefers-reduced-motion)
  Scrollspy: smooth scroll a sección
```

---

## Archivos clave

| Archivo | Rol |
|---------|-----|
| `EpisAppShellLayout.tsx` | Shell N0 |
| `EpisPatientChartShell.tsx` | N1 + N2 |
| `EpisClinicalScrollspyLayout.tsx` | N3 |
| `EpisClinicalActionDock.tsx` | N4 |
| `ClinicalShellLayout.tsx` | Wire web clínico |
| `ClinicalPatientChartChrome.tsx` | Cabecera dinámica por ruta |
| `patientChartNavigation.ts` | Mapa tabs → rutas |
| `EPIS2_CLINICAL_TWO_PANE_LAYOUT.md` | Canon split Enfoque/Contexto |
| `EPIS2_M3_SYMMETRY_AND_FRAMING.md` | Grid 8dp formularios |

---

## Próximos pasos

1. Badges de alergia en `EpisPatientContextBar` desde API CDS (no solo demo).
2. Bottom App Bar alternativa en compacto (<600px) si FAB compite con teclado virtual.
3. Expandable Cards M3 para secciones opcionales del blueprint (hoy: Accordion EPIS2).
4. Pasada visual `npm run quality:m3-visual-pass` en ficha + evolución split.
