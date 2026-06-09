# EPIS2 — Modo Dashboard Material Design 3

**Microfase:** MF-DASHBOARD-MD3-AI-DESIGN-AGENTS  
**Estado:** Canónico como tercer modo (junto Command Center y Classic EMR)

## Los tres modos de EPIS2

| Modo | Ruta | Función |
|------|------|---------|
| Command Center | `/comando` | Entrada principal — intención, búsqueda, barra Google clínica |
| Classic EMR | `/espacio/ficha?mode=classic` | Ficha tradicional — paneles fijos, escritura clínica |
| Dashboard | `/epis2/dashboard?mode=dashboard` | Sala de control operacional — colas, KPIs, grillas |

**Dashboard no es home.** Home canónica = `/comando`.

## Qué responde el Dashboard

- ¿Qué pacientes requieren acción?
- ¿Qué pendientes están vencidos?
- ¿Qué documentos faltan por firmar?
- ¿Qué resultados críticos requieren acuse?
- ¿Qué medicamentos requieren validación?
- ¿Qué servicio/unidad está saturado?

## Qué NO responde

- Toda la ficha del paciente (usar Classic o workspace).
- Todos los formularios a la vez.
- Firmar/aprobar automáticamente.

## Principios MD3

- Scaffold fijo `100dvh`, scroll principal solo en área central.
- Top bar + scope bar fijas.
- Navigation rail ≤7 destinos visibles; resto bajo “Más”.
- KPI strip: 4–6 indicadores **accionables** (cada uno abre grilla filtrada).
- Grillas compactas para datos repetitivos; cards solo para KPIs.
- Detail pane colapsable — contexto, no reemplazo de ficha.
- Command bar reutiliza `packages/command-registry`.
- Status bar sobria — sin botones clínicos principales.

## Canon clínico

Login → Centro de Comando → paciente/intención → formulario mínimo → borrador → aprobación humana.

El dashboard puede **abrir** pacientes, workspaces, formularios o modo clásico; no firma ni aprueba solo.

## Activación

- URL: `?mode=dashboard` en `/epis2/dashboard`.
- Preferencia: `defaultDashboardView` en `epis2-user-preferences` (ver `modes/episModePreferences.ts`).
- Runtime: `useDashboardMd3Mode()` desde [`modes/index.js`](../../apps/web/src/modes/index.ts).
- Tabs: `buildDashboardTabSearch()` en `modes/episModeSearch.ts`.

Orquestación compartida: [`EPIS2_THREE_MODES_ORCHESTRATION.md`](EPIS2_THREE_MODES_ORCHESTRATION.md) · [`EPIS2_MODES_LAYER.md`](../architecture/EPIS2_MODES_LAYER.md).

## Componentes

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
```

## Frase guía

EPIS2 Dashboard no es una página bonita de métricas; es una sala de control clínica con indicadores accionables, grillas compactas, filtros claros, comando disponible y cero acciones irreversibles escondidas.
