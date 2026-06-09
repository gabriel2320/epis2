# EPIS2 — Modo Classic EMR Material Design 3

**Microfase:** MF-CLASSIC-MD3 · **Estado:** Canónico (vista alternativa; `/comando` intacto)

## Los tres modos de EPIS2

| Modo | Ruta | Función |
|------|------|---------|
| Command Center | `/comando` | Entrada principal — intención, búsqueda |
| **Classic EMR** | `/espacio/ficha?mode=classic` | Ficha tradicional — paneles fijos MD3 |
| Dashboard | `/epis2/dashboard?mode=dashboard` | Sala de control operacional |

**Classic no es home.** Requiere paciente activo. Orquestación: [`EPIS2_THREE_MODES_ORCHESTRATION.md`](EPIS2_THREE_MODES_ORCHESTRATION.md).

## Objetivo

Vista alternativa EMR (supporting pane, nav lateral fija) para usuarios que prefieren ese patrón, **sin** duplicar registries ni reemplazar command-first.

## Activación

| Mecanismo | Detalle |
|-----------|---------|
| URL | `?mode=classic` en rutas `/espacio/*` |
| Vista admin dashboard | `?view=classic` en `/epis2/dashboard` (enlace nav clásica) |
| Preferencia | `defaultPatientView: 'classic'` en `epis2-user-preferences` |
| Detección runtime | `useClassicMd3Mode()` desde `modes/index.js` |

## Componentes

```
apps/web/src/components/classic-md3/
  EpisClassicMd3Shell.tsx
  EpisClassicMd3TopAppBar.tsx
  EpisClassicMd3LeftNavigation.tsx
  EpisClassicMd3SupportingPane.tsx
  ClassicMd3WorkspaceLayout.tsx
  ClassicMd3ClinicalPageShell.tsx
  ClassicMd3PreferencesSection.tsx

apps/web/src/classic-md3/
  classicNavDestinations.ts    → classicModeSearch desde modes/
  useClassicMd3Mode.ts         → shim deprecated
  userPreferences.ts           → shim → episModePreferences
```

## Principios MD3

- Scaffold `100dvh`, scroll `main-pane-only`
- Top bar fija; volver a comando vía `useEpisSession().openCommandCenter`
- Supporting pane colapsable 320–360px
- ActionBar única en main pane; top bar sin guardar/firmar
- Command bar delega en `EpisUniversalCommandBar` / `useClinicalCommandSubmit`

## Integración modos

- `EpisModeSwitcher` en `EpisClassicMd3TopAppBar`
- `EpisModeGuard` — redirige a `/comando?intent=selectPatient&nextMode=classic` sin paciente
- Navegación lateral: `classicNavDestinations.ts` + `classicModeSearch()`

## RAD / registry

Entradas `radScreenRegistry`: `patient-chart-classic`, `clinical-form-evolution-classic`, `dashboard-classic-view`.

## Gates

```bash
npm run quality:classic-md3-mode-gate
npm run quality:classic-fixed-panels-gate
npm run quality:classic-supporting-pane-gate
npm run quality:three-modes-gate
```

## Frase guía

Classic EMR es un marco de trabajo al paciente, no una segunda aplicación — misma API, mismos borradores, misma aprobación humana.
