# MF-THREE-MODES — Consolidación de árboles de modo

**Fecha:** 2026-06-08  
**Alcance:** Unificar detección de modo, search helpers, preferencias y navegación.

## Problema

Tres árboles paralelos duplicaban lógica:

1. `classic-md3/useClassicMd3Mode.ts` — subscribe + prefs + search
2. `dashboard-md3/useDashboardMd3Mode.ts` — idem
3. `modes/episModes.ts` — `resolveActiveMode` (session/guards)

Además: `userPreferences.ts` duplicaba `episModePreferences.ts`; navegación directa en dashboard MD3 top bar.

## Solución

### Núcleo canónico (`apps/web/src/modes/`)

| Archivo | Responsabilidad |
|---------|-----------------|
| `episModeSearch.ts` | `parseModeSearchRecord`, `classicModeSearch`, `dashboardModeSearch`, `buildDashboardTabSearch`, `EPIS_SELECT_PATIENT_FOR_CLASSIC` |
| `episModeRuntime.ts` | `useEpisActiveMode`, `useEpisModeSearchRecord`, `useEpisModePreferences`, `useClassicMd3Mode`, `useDashboardMd3Mode` |
| `episModePreferences.ts` | localStorage unificado |
| `index.ts` | Barrel único |
| `modeTransitions.ts` | `navigateToMode` central |

### Shims (compat)

- `classic-md3/useClassicMd3Mode.ts` → re-export
- `dashboard-md3/useDashboardMd3Mode.ts` → re-export
- `classic-md3/userPreferences.ts` → re-export

### Conexiones

- `EpisSessionContext` — hooks runtime + `EPIS_SELECT_PATIENT_FOR_CLASSIC`
- `DashboardMd3WorkspaceLayout` — `openCommandCenter` / `openClassicMode` vía sesión
- `DashboardModeContent` — `buildDashboardTabSearch` + `setLastDashboardTab`
- `classicNavDestinations` — import desde `modes/episModeSearch`
- `navigateClinicalCommandResult` — `resolveModeRoute('dashboard', …)`

### Registro

- `docs/design/EPIS2_THREE_MODES_ORCHESTRATION.md`
- `radScreenRegistry` — entrada `three-modes-orchestration`
- Tests — `episModeSearch.test.ts`

## Gates

```bash
npm run check
npm run test -- apps/web/src/modes
npm run quality:three-modes-gate
npm run db:validate
```

## Riesgos

- Shims deprecated: migrar imports a `modes/index` en fases futuras
- Modal borrador no guardado sigue pendiente

## Próximo paso

Plan formal: [`docs/product/EPIS2_THREE_MODES_DEV_PLAN.md`](../docs/product/EPIS2_THREE_MODES_DEV_PLAN.md).  
Siguiente microfase: **MF-THREE-MODES-03** (modal borrador) → **05** (dashboard fila → classic) → **07** (E2E).
