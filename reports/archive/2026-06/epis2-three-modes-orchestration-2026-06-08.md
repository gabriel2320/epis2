# MF-THREE-MODES-01 — Reporte de cierre

**Programa:** PROG-THREE-MODES · **Roadmap:** EPIS2-PM-01  
**Fecha:** 2026-06-08  
**Alcance:** Login → Command Center → Classic EMR → Dashboard

> Alias histórico del reporte: ~~MF-THREE-MODES-ORCHESTRATION~~ → unificado como **MF-THREE-MODES-01**.

## Objetivo

Armonizar tres modos complementarios con **una sesión**, **un contexto clínico compartido** y **cero routers paralelos**.

## Arquitectura final

| Modo | Ruta | Home |
|------|------|------|
| Command | `/comando` | **Sí** |
| Classic | `/espacio/ficha?mode=classic&patientId=…` | No |
| Dashboard | `/epis2/dashboard?mode=dashboard&tab=…` | No |

**Frase guía:** EPIS2 tiene tres modos, pero una sola mente: el usuario entra por comando, trabaja al paciente en clásico y gobierna el servicio en dashboard.

## Componentes creados

```
apps/web/src/modes/
  episModes.ts
  episModeGuards.ts
  modeTransitions.ts
  EpisModeGuard.tsx

apps/web/src/session/
  EpisSessionContext.tsx

apps/web/src/components/modes/
  EpisModeSwitcher.tsx

apps/web/src/components/command/
  EpisUniversalCommandBar.tsx

apps/web/src/status/
  EpisSystemStatus.ts
```

## Flujo desde login

1. `/login` → autenticar  
2. Redirigir **siempre** a `/comando` (`getDefaultModeAfterLogin` = command)  
3. Hub muestra: barra Google, classic access, dashboard access, pacientes recientes  
4. Mode switcher en Command / Classic / Dashboard top bars  
5. Transiciones vía `modeTransitions.ts` + `EpisSessionContext`

## Integraciones

- `main.tsx` — `EpisSessionProvider`  
- `ClinicalGlobalTopBar`, `EpisClassicMd3TopAppBar`, `EpisDashboardMd3TopBar` — mode switcher  
- `EpisCommandCenterGoogleBar` — hub classic + dashboard  
- `navigateClinicalCommandResult` — `mode=dashboard` al abrir tablero  
- Classic/Dashboard command bars → `EpisUniversalCommandBar`  
- `EpisModeGuard` — classic sin paciente, dashboard sin permiso  
- Design agents — `threeModesDesignAgents.ts` (6 agentes, off por defecto)

## Gates añadidos

- `quality:login-command-home-gate`
- `quality:mode-switcher-gate`
- `quality:mode-guards-gate`
- `quality:mode-transitions-gate`
- `quality:command-center-hub-gate`
- `quality:classic-mode-isolation-gate`
- `quality:dashboard-mode-isolation-gate`
- `quality:mode-safety-gate`
- `quality:three-modes-design-agents-gate`
- `quality:three-modes-gate` (extendido)

## Screenshots advisory

`reports/screenshots/three-modes/README.md`

## Riesgos pendientes

- Confirmación explícita de borrador no guardado en transiciones (modal pendiente)  
- Query params `returnTo`, `intent`, `nextMode` sin validación tipada en router  
- Captura Playwright automatizada pendiente

## Feature flags

- Modos: URL `mode=classic|dashboard` + preferencias visuales existentes  
- Agentes IA: `EPIS2_DESIGN_AGENTS_ENABLED=false` por defecto  
- Design mode: `VITE_ENABLE_DESIGN_MODE=true`

## Próximo paso

Conectar selección de fila dashboard → `transitionDashboardToClassic` con `returnTo`; modal borrador no guardado en `EpisModeGuard`.
