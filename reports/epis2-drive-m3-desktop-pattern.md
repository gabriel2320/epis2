# EPIS2 — Patrón UI escritorio tipo Google Drive / M3

**Fecha:** 2026-06-05  
**Alcance:** Tema `@epis2/epis2-ui`, layouts clínicos, páginas web y tokens de isla.

## Objetivo

Aplicar en todas las páginas la anatomía de escritorio descrita (Material Design 3 / Google Drive):

- Canvas `#F3F6FC` fuera del contenido
- Islas blancas `#FFFFFF` con radio 16–24px, sin sombras pesadas
- Barra de búsqueda en píldora
- Tipografía Google Sans Text (display) + Roboto (cuerpo)
- Grid base 8px

## Cambios principales

| Área | Archivos |
|------|----------|
| Tokens isla | `packages/epis2-ui/src/theme/island-layout.ts` (nuevo/ampliado) |
| Color / forma | `color-roles.ts`, `shape.ts`, `visual-identity.ts`, `typography.ts`, `components.ts` |
| Fuentes | `apps/web/index.html` |
| Layouts | `ClinicalShellLayout`, `EpisCommandCenterLayout`, `EpisAuthScreen`, `EpisDashboardShell` |
| Formularios | `clinical-field-layout.tsx` → isla blanca |
| Comando | `EpisCommandBar.tsx` → `epis2PillBarSx` |
| Widgets | `Epis2WidgetSurface.tsx` |
| Páginas web | `PatientWorkspacePage`, `DraftReviewPage`, `NotFoundPage` → `epis2ShellContentIslandSx` |

## Tokens exportados

- `epis2CanvasSx` — fondo de aplicación
- `epis2IslandSx` — contenedor blanco redondeado
- `epis2IslandPaddingSx` / `epis2IslandMarginSx` — espaciado grid 8px
- `epis2ShellContentIslandSx` — isla + padding para rutas dentro de `ClinicalShellLayout` (sin margen duplicado)
- `epis2PageIslandSx` — composición completa (isla + padding + margen) para páginas autónomas
- `epis2PillBarSx` — barra de búsqueda / comando en píldora

## Decisiones de diseño

1. **Evitar isla doble:** el shell clínico aporta canvas + margen; cada página aporta su isla blanca.
2. **Formularios:** mantienen labels estáticos, sin muesca MUI, sin transiciones en campos (sin regresión de “temblor”).
3. **Elevación:** plana en modo claro; sombras suaves solo en modo oscuro.

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 209 tests |
| `npm run db:validate` | OK |

## Riesgos

- Páginas de error/loading fuera de isla (p. ej. estados intermedios en ficha/borrador) — aceptable; contenido principal ya usa isla.
- Modo oscuro conserva gradientes; patrón Drive aplica principalmente a modo claro.

## Próximo paso

Validación visual en `http://127.0.0.1:5173`: Comando, login, `/espacio/*`, dashboard, ficha y borrador. Ajustar chips/filtros en listas si se desea paridad total con Drive.
