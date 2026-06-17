# MF-THREE-MODES-03…06 — Sesión automatizada

**Fecha:** 2026-06-04  
**Programa:** PROG-THREE-MODES · **Roadmap:** EPIS2-PM-01  
**Alcance:** Navegación unificada vía `EpisSessionContext`, modal borrador (MF-03), router tipado parcial (MF-04), dashboard→classic (MF-05), migración imports parcial (MF-06).

## Entregado

| MF | Estado | Cambio principal |
|----|--------|------------------|
| **03** Modal borrador | **DONE (MVP)** | `modeTransitionSafety.ts` + diálogo en `EpisModeSwitcher` + probe `formState.isDirty` en `GeneratedClinicalFormPage` |
| **04** Router tipado | **Parcial** | `CommandSearch`, `parseCommandSearch`, `DASHBOARD_TAB_SET` export; ruta `/comando` en `ClinicalNavigateOptions`; fix `useWidgetActions` |
| **05** Dashboard→Classic | **DONE** | `openClassicMode(patientId, tab)` en `DashboardMd3WorkspaceLayout`; intent `selectPatient` en `CommandCenterPage` |
| **06** Migrar imports | **Parcial** | `ClinicalShellLayout`, `PatientWorkspacePage`, `GeneratedClinicalFormPage`, `DashboardModeContent` → `modes/episModeRuntime` |

### Navegación centralizada (sin `navigate` directo fuera de sesión)

- `ClassicMd3WorkspaceLayout` → `openCommandCenter`
- `DashboardModeContent` → `openCommandCenter`
- `epis2NavigationRail` → `openDashboardMode('work')`
- `CommandCenterRecentActivity` → `openDashboardMode('work')`
- `PatientWorkspacePage` longitudinal CTAs → `openDashboardMode(tab)`

### Tests

- Nuevo harness `apps/web/src/test/renderWithEpisApp.tsx` (`EpisSessionProvider` + mocks router).
- Actualizados tests de páginas/shells afectados por sesión de modos.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run db:validate` | OK |
| `npm run quality:three-modes-gate` | OK |
| `npx vitest run apps/web` | OK |
| `npm run test` (suite completa) | **Parcial** — integración API/golden journey requieren PostgreSQL `:5433` (ECONNREFUSED); no regresión web |

## Riesgos

1. **MF-04 incompleto:** `router.tsx` aún no valida `CommandSearch` en la ruta `/comando`.
2. **MF-06 incompleto:** shims `classic-md3/useClassicMd3Mode` y `dashboard-md3/useDashboardMd3Mode` siguen existiendo (MF-08 bloqueado).
3. **MF-07 pendiente:** E2E Playwright tres modos no iniciado.
4. **Integración local:** golden journey y tests API fallan sin DB demo levantada.

## Próximo paso (automatizable, sin aprobación humana)

1. **MF-THREE-MODES-07** — Playwright: comando → classic → dashboard → retorno.
2. Cerrar **MF-04** — `validateSearch` en ruta `/comando` del router.
3. Cerrar **MF-06** — grep imports shims → `modes/index`; luego **MF-08** eliminar shims.

## Frase guía

*EPIS2 tiene tres modos, pero una sola mente.*
