# EPIS2 — Capa de modos (conciliación arquitectónica)

> **SUPERSEDED_DOC fence (2026-06-19):** conservar como referencia historica de modos. No usar para planificar home ni estrategia principal. Canon vigente: CICA GO `/app/buscar`; Classic MD3, dashboard y three modes son secundarios/fallback.

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Estado:** SUPERSEDED como canon operativo — complementa navegacion historica, no reemplaza CICA

> Concilia **tres modos de experiencia** (Command · Classic · Dashboard) con **workspaces N0–N4**, **registries únicos** e **invariantes de producto**.

---

## 1. Dos ejes ortogonales

EPIS2 separa dos dimensiones que no deben mezclarse:

| Eje | Qué responde | Artefacto |
|-----|--------------|-----------|
| **Modo de experiencia** | ¿Command, Classic EMR o Dashboard MD3? | `apps/web/src/modes/` |
| **Workspace clínico** | ¿Ambulatorio, UCI, calidad, admin? | `clinicalWorkspaceRegistry.ts`, rail N0 |

```text
                    MODOS (transversal)
                           │
     Command ◄─────────────┼─────────────► Classic / Dashboard
         │                 │                      │
         └─────── HOME ────┴── secundarios ──────┘

                    WORKSPACES (contexto rol/servicio)
     command · ambulatory · icu · quality_iaas · admin_system
```

**Regla:** el modo no crea rutas nuevas; activa **layouts y search** sobre rutas existentes.

---

## 2. Mapa modo × ruta × layout

| Modo | Activación | Ruta principal | Scaffold | Home |
|------|------------|----------------|----------|------|
| **command** | default tras login | `/comando` | `EpisAppScaffold` | **Sí** |
| **classic** | `?mode=classic` + `patientId` | `/espacio/ficha`, `/espacio/*` | `EpisClassicMd3Shell` | No |
| **dashboard** | `?mode=dashboard` | `/epis2/dashboard` | `EpisDashboardMd3Shell` | No |

Preferencias locales (`epis2-user-preferences`):

- `defaultPatientView`: `modern` | `classic`
- `defaultDashboardView`: `dashboard` | (legacy implícito)

---

## 3. Árbol de código canónico

```text
apps/web/src/modes/                    ← fuente única
  episModes.ts                         resolveActiveMode, EPIS_MODES
  episModeGuards.ts                    canOpenMode, resolveModeRoute
  episModeSearch.ts                    ?mode=, buildDashboardTabSearch
  episModeRuntime.ts                   hooks React unificados
  episModePreferences.ts               localStorage
  modeTransitionSafety.ts              probes borrador no guardado (MF-03)
  EpisModeGuard.tsx                    guard classic sin paciente
  index.ts                             barrel

apps/web/src/session/
  EpisSessionContext.tsx               sesión + transiciones UI
```

Import preferente: `import { … } from '../modes/index.js'`.  
Shims deprecated **eliminados** (MF-THREE-MODES-08) — no reintroducir.

---

## 4. Conciliación con navegación reconciliada

El árbol [`EPIS2_RECONCILED_NAVIGATION_TREE.md`](EPIS2_RECONCILED_NAVIGATION_TREE.md) describe **superficies clínicas**. Esta capa describe **cómo se enmarcan**:

```text
EPIS2 (navegación)
├── /espacio/buscar-paciente          → home censo clínico + barra transversal
├── /comando                          → redirect compat (→ censo)
├── /espacio/ficha?patientId=
│   ├── (modern)                      → workspace ambulatory M3
│   └── ?mode=classic                 → modo classic EMR MD3
├── /espacio/* (formularios)          → modern o ?mode=classic
└── /epis2/dashboard?tab=
    ├── legacy scaffold               → tablero RAD
    └── ?mode=dashboard               → modo dashboard MD3
```

**No contradice** invariante #6-7: dashboard sigue siendo secundario; **home = censo clinico CICA** (`/app/buscar`).

---

## 5. Conciliación con capas UI (L3–L5)

| Capa | Relación con modos |
|------|-------------------|
| **L3** scaffold | Cada modo tiene shell propio; gates ui-simplify aplican por scaffold |
| **L4** RAD | `radScreenRegistry` registra variantes classic/dashboard MD3 |
| **L5** productivity | Command bar universal; palette compartida vía `EpisUniversalCommandBar` |

Modos **no** añaden capa L6: son orquestación transversal sobre L3.

Detalle: [`EPIS2_UI_LAYERS.md`](../product/EPIS2_UI_LAYERS.md)

---

## 6. Registries y fronteras

| Registry | Rol respecto a modos |
|----------|---------------------|
| Command Registry | Una sola fuente; `navigateClinicalCommandResult` usa `resolveModeRoute('dashboard')` |
| Form Registry | Sin duplicación por modo; mismo blueprint en modern/classic |
| Widget Registry | Sin variantes por modo en v1 |
| `radScreenRegistry` | Entradas `patient-chart-classic`, `dashboard-md3`, `three-modes-orchestration` |

**Prohibido:** segundo router, segundo Command Registry, home en dashboard.

---

## 7. Sesión y transiciones

`EpisSessionProvider` (`main.tsx`):

- `activeMode` — derivado de ruta + search + prefs
- `openCommandCenter` · `openClassicMode` · `openDashboardMode`
- `setLastDashboardTab` — sessionStorage
- `returnToPreviousMode` — pila simple (sin modal borrador aún)

Transiciones canónicas: [`EPIS2_THREE_MODES_ORCHESTRATION.md`](../design/EPIS2_THREE_MODES_ORCHESTRATION.md)

---

## 8. Gates

```bash
npm run quality:three-modes-gate
npm run quality:mode-switcher-gate
npm run quality:login-command-home-gate
npm run quality:classic-md3-mode-gate      # classic aislado
npm run quality:dashboard-md3-mode-gate    # dashboard aislado
```

Tests: `apps/web/src/modes/*.test.ts`

---

## 9. Referencias

| Documento | Rol |
|-----------|-----|
| [`EPIS2_THREE_MODES_ORCHESTRATION.md`](../design/EPIS2_THREE_MODES_ORCHESTRATION.md) | Comportamiento UX + transiciones |
| [`EPIS2_THREE_MODES_DEV_PLAN.md`](../product/EPIS2_THREE_MODES_DEV_PLAN.md) | Nomenclatura canónica · MF-03…08 · **EPIS2-PM-01** |
| [`EPIS2_DASHBOARD_MD3_MODE.md`](../design/EPIS2_DASHBOARD_MD3_MODE.md) | Modo dashboard |
| [`EPIS2_CLASSIC_EMR_MD3_MODE.md`](../design/EPIS2_CLASSIC_EMR_MD3_MODE.md) | Modo classic |
| [`PRODUCT_INVARIANTS.md`](../product/PRODUCT_INVARIANTS.md) | #6 home, #7 no dashboard home |
| [`EPIS2_RECONCILED_NAVIGATION_TREE.md`](EPIS2_RECONCILED_NAVIGATION_TREE.md) | Superficies clínicas |

---

## Frase guía

> Tres modos, una sesión, cero routers paralelos — workspaces MD3 siguen siendo el mapa clínico; modos son el marco de experiencia.
