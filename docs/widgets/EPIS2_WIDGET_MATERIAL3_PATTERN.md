# EPIS2 — Patrón Material 3 para widgets

Usar **únicamente** el tema existente (`createEpis2Theme` / `Epis2ThemeProvider`). Prohibido segundo tema.

## Componentes (`@epis2/epis2-ui`)

| Componente | Uso |
|------------|-----|
| `Epis2WidgetGrid` | Rejilla 12 columnas adaptativa (compact/medium/expanded) |
| `Epis2WidgetSurface` | Contenedor outlined, fondo transparente, span en rejilla |
| `Epis2WidgetHeader` | Título, descripción, chip demo |
| `Epis2WidgetBody` | Contenido clínico legible |
| `Epis2WidgetActions` | Botones que navegan o disparan comando |
| `Epis2WidgetLoading` | Estado cargando |
| `Epis2WidgetEmpty` | Sin datos |
| `Epis2WidgetError` | Fallo de carga |
| `Epis2WidgetForbidden` | Rol no autorizado |
| `Epis2WidgetOffline` | Sin conexión / sin IA |
| `Epis2WidgetAiDisclosure` | Aviso de revisión humana |

## Composición ejemplo

```tsx
<Epis2WidgetSurface columnSpan={6} minHeight={160}>
  <Epis2WidgetHeader title="Resumen del paciente" badge="DEMO" />
  <Epis2WidgetBody>{/* contenido */}</Epis2WidgetBody>
  <Epis2WidgetActions actions={[{ id: '1', label: 'Ver resumen', href: '/espacio/resumen' }]} />
</Epis2WidgetSurface>
```

## Frontera MUI

- Widgets en `epis2-ui` pueden usar primitivos EPIS2 (re-export MUI).
- `packages/epis2-widgets` **no** importa MUI.
- `apps/web` consume `epis2-ui` + `epis2-widgets`; no importa `@mui/material` para widgets.

## Motion

`resolveWidgetPlacement(..., reducedMotion: true)` desactiva transiciones de rejilla.
