# MF-DASHBOARD-MD3-AI-DESIGN-AGENTS — Reporte de cierre

**Fecha:** 2026-06-08  
**Alcance:** Modo Dashboard MD3 como tercer modo canónico + agentes locales de diseño

## Objetivo

Fortalecer el Modo Dashboard operacional (`/epis2/dashboard?mode=dashboard`) sin reemplazar `/comando` ni la ficha clásica.

## Tres modos EPIS2

| Modo | Ruta | Scaffold |
|------|------|----------|
| Command Center | `/comando` | EpisAppScaffold + Google bar |
| Classic EMR | `/espacio/ficha?mode=classic` | EpisClassicMd3Shell |
| Dashboard MD3 | `/epis2/dashboard?mode=dashboard` | EpisDashboardMd3Shell |

## Componentes creados

```
apps/web/src/components/dashboard-md3/
  EpisDashboardMd3Shell.tsx
  EpisDashboardMd3TopBar.tsx
  EpisDashboardMd3ScopeBar.tsx
  EpisDashboardMd3NavigationRail.tsx
  EpisDashboardMd3KpiStrip.tsx
  EpisDashboardMd3MainGrid.tsx
  EpisDashboardMd3DetailPane.tsx
  EpisDashboardMd3CommandBar.tsx
  EpisDashboardMd3StatusBar.tsx
  DashboardMd3WorkspaceLayout.tsx

apps/web/src/dashboard-md3/
  useDashboardMd3Mode.ts
  dashboardNavDestinations.ts
  dashboardScopeFilters.ts
  dashboardCommandSuggestions.ts
```

## Integración

- `DashboardModeContent.tsx` — bifurca legacy vs MD3 con `?mode=dashboard`
- `clinicalNavigate.ts` — `DashboardSearch.mode?: 'dashboard'`
- Design mode overlay — chips dashboard MD3
- RAD registry — entrada `dashboard-md3`

## KPIs (tab trabajo)

| KPI | Owner | Acción |
|-----|-------|--------|
| Borradores abiertos | Equipo clínico | Scroll a grilla |
| Pendientes revisión | Equipo clínico | Scroll a grilla |
| Sugerencias demo | Equipo clínico | Ir a `/comando` |

## Agentes IA (advisory, off por defecto)

8 agentes en `dashboardDesignAgents.ts` + schemas Zod extendidos.

## Gates añadidos

- `quality:dashboard-md3-mode-gate`
- `quality:dashboard-kpi-actionability-gate`
- `quality:dashboard-grid-surface-gate`
- `quality:dashboard-bulk-actions-gate`
- `quality:dashboard-data-quality-gate`
- `quality:dashboard-design-agents-gate`
- `quality:dashboard-screenshot-advisory`
- `quality:three-modes-gate`

## Screenshots

Advisory: `reports/screenshots/dashboard-md3/README.md`

## Riesgos pendientes

- Captura Playwright automatizada pendiente (advisory only)
- Detail pane aún sin selección de fila en todos los dominios
- Preferencia `defaultDashboardView` en UI de apariencia no expuesta aún

## Feature flag

Activar MD3: URL `?mode=dashboard` o preferencia local `defaultDashboardView: 'dashboard'`.  
Agentes: `EPIS2_DESIGN_AGENTS_ENABLED=true` (opcional, Ollama local).

## Próximo paso

Conectar selección de fila → detail pane en Pharmacy/Nursing/Service tabs; captura Playwright advisory.

**Frase guía:** EPIS2 Dashboard no es una página bonita de métricas; es una sala de control clínica con indicadores accionables, grillas compactas, filtros claros, comando disponible y cero acciones irreversibles escondidas.
