# Reporte — WIDGET-00 Widget Registry and Contextual Infrastructure

**Fecha:** 2026-06-05 · **Alcance:** Fundación de widgets contextuales (sin WIDGET-01)

## Entregables

| Área | Estado |
|------|--------|
| Paquete `@epis2/epis2-widgets` | ✓ |
| Contratos tipados | ✓ |
| Registry único + 6 widgets demo | ✓ |
| Visibilidad, permisos, layout | ✓ |
| Gates en paquete + arquitectura | ✓ |
| Componentes `Epis2Widget*` en epis2-ui | ✓ |
| Documentación `docs/widgets/*` | ✓ |
| Integración en `npm run build/test/check` | ✓ |

## Gates ejecutados

- `single-widget-registry.mjs`
- `widget-registry-gates.mjs`
- Tests vitest: registry, visibility, permissions, layout, UI surface

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Montaje en web sin WIDGET-01 | Sin cambios en rutas; home sigue en `/comando` |
| Duplicación futura de registry | Gate `single-widget-registry` |
| Widgets dashboard en home | `resolveWidgetVisibility` bloquea categoría `dashboard` en `command-center` |

## Próximo paso

**WIDGET-01** — montaje contextual en Centro de Comando y ficha (fuera de este alcance).

## Frase guía

*Los widgets muestran lo necesario, cuando es necesario, y siempre conducen al trabajo clínico.*
