# EPIS2 — Orquestación de tres modos

> **SUPERSEDED_DOC fence (2026-06-19):** three modes queda congelado como referencia secundaria. No usar como estrategia principal ni home. Canon vigente: CICA GO `/app/buscar`.

**Programa:** PROG-THREE-MODES · **Microfase:** MF-THREE-MODES-01…02 (consolidado)  
**Roadmap:** EPIS2-PM-01 · **Plan global:** Fase UX-1  
**Canon vigente:** Home = `/app/buscar`. Dashboard ≠ home. IA no aprueba ni firma.

## Principio

EPIS2 tiene **tres modos complementarios** y **una sola mente**:

| Modo | Ruta canónica | Rol |
|------|---------------|-----|
| Command | `/comando` | Decidir intención; **home tras login** |
| Classic | `/espacio/ficha?mode=classic&patientId=…` | Trabajo al paciente (EMR MD3) |
| Dashboard | `/epis2/dashboard?mode=dashboard&tab=…` | Sala de control operacional |

Sin routers paralelos. Sin segundo Command Registry.

## Árbol canónico (`apps/web/src/modes/`)

```
modes/
  episModes.ts           — definición y resolveActiveMode
  episModeGuards.ts      — canOpenMode, resolveModeRoute
  episModeSearch.ts      — query ?mode=, helpers de search
  episModeRuntime.ts     — hooks React (useEpisActiveMode, useClassicMd3Mode…)
  episModePreferences.ts — localStorage epis2-user-preferences
  modeTransitions.ts     — navigateToMode + 6 transiciones
  EpisModeGuard.tsx      — guard de ruta (classic sin paciente)
  index.ts               — barrel único
```

### Flujo de transiciones

```
command ──openClassicMode──► classic (requiere patientId)
   │                              │
   └──openDashboardMode──► dashboard
        ◄──returnTo───────────────┘
```

Implementación: `EpisSessionContext` + `modeTransitions.ts`.

## Shims de compatibilidad (deprecated)

| Path legacy | Re-exporta desde |
|-------------|------------------|
| `classic-md3/useClassicMd3Mode.ts` | `modes/episModeRuntime` + `episModeSearch` |
| `dashboard-md3/useDashboardMd3Mode.ts` | `modes/index` |
| `classic-md3/userPreferences.ts` | `modes/episModePreferences` |

Importar preferentemente desde `modes/index.js`.

## Sesión compartida

`EpisSessionProvider` (`session/EpisSessionContext.tsx`):

- `activeMode` vía `useEpisActiveMode()`
- Preferencias vía `useEpisModePreferences()`
- `openCommandCenter`, `openClassicMode`, `openDashboardMode`
- `setLastDashboardTab` — persiste tab dashboard en sessionStorage

## Detección de modo MD3

Un solo árbol de runtime:

- **Classic MD3:** `?mode=classic` | `?view=classic` | pref `defaultPatientView=classic`
- **Dashboard MD3:** `?mode=dashboard` | pref `defaultDashboardView=dashboard` (salvo `view=classic`)

## Integraciones UI

- `EpisModeSwitcher` — Command / Classic / Dashboard top bars
- `EpisUniversalCommandBar` — barras de comando compartidas
- `DashboardMd3WorkspaceLayout` — top bar usa `useEpisSession()` (no navigate directo)
- `navigateClinicalCommandResult` — `resolveModeRoute('dashboard', …)`

## Gates

- `quality:three-modes-gate`
- `quality:mode-switcher-gate`
- `quality:login-command-home-gate`

## Pendiente (post-consolidación)

Ver plan detallado: [`EPIS2_THREE_MODES_DEV_PLAN.md`](../product/EPIS2_THREE_MODES_DEV_PLAN.md).

- MF-THREE-MODES-03: Modal borrador no guardado en transiciones
- MF-THREE-MODES-04: Tipado router para `intent`, `returnTo`, `nextMode`
- MF-THREE-MODES-05: `transitionDashboardToClassic` en click de fila dashboard
- MF-THREE-MODES-07: Journey E2E Playwright

---

## Referencias del proyecto

| Documento | Rol |
|-----------|-----|
| [`EPIS2_MODES_LAYER.md`](../architecture/EPIS2_MODES_LAYER.md) | Conciliación modos × workspaces × L3–L5 |
| [`EPIS2_CLASSIC_EMR_MD3_MODE.md`](EPIS2_CLASSIC_EMR_MD3_MODE.md) | Modo classic |
| [`EPIS2_DASHBOARD_MD3_MODE.md`](EPIS2_DASHBOARD_MD3_MODE.md) | Modo dashboard |
| [`EPIS2_RECONCILED_NAVIGATION_TREE.md`](../architecture/EPIS2_RECONCILED_NAVIGATION_TREE.md) | Superficies clínicas |
| [`EPIS2_UI_LAYERS.md`](../product/EPIS2_UI_LAYERS.md) | Stack L3–L5 |
| [`EPIS2_GLOBAL_DEV_PLAN.md`](../product/EPIS2_GLOBAL_DEV_PLAN.md) | Plan global · **Fase UX-1** |
| [`EPIS2_THREE_MODES_DEV_PLAN.md`](../product/EPIS2_THREE_MODES_DEV_PLAN.md) | Nomenclatura + MF-03…08 |
