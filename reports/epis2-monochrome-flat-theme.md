# EPIS2 — Tema monocromático plano

**Fecha:** 2026-06-05  
**Alcance:** `@epis2/epis2-ui` + shell web. Misma arquitectura de islas/píldoras; paleta neutra.

## Cambio

Variante más plana, elegante y monocromática del patrón Drive/M3:

| Antes | Ahora |
|-------|-------|
| Canvas azulado `#F3F6FC` | Canvas neutro `#F5F5F7` |
| Bordes en islas y tarjetas | Separación solo por tono (sin borde) |
| Botones con gradiente | Botones sólidos charcoal `#27272A` |
| Chips de comando multicolor | Píldoras grises; énfasis por icono |
| Acento por defecto `clinicalBlue` | Acento por defecto `neutral` |
| Sombras MUI graduales | Sombras `none` (plano) |

## Archivos tocados

- `color-roles.ts` — superficies zinc, preset `neutral` refinado
- `visual-identity.ts` — sin gradientes ni radiales
- `island-layout.ts` — islas y píldora sin borde
- `components.ts` — botones/chips/inputs monocromáticos
- `chip-tones.ts` — chips de comando unificados en gris
- `create-epis2-theme.ts` — acento default `neutral`
- `EpisThemePreferences.tsx` — storage `v2`, default neutral
- `ClinicalShellLayout.tsx` — AppBar sin línea divisoria
- `apps/web/index.html` — `theme-color` `#F5F5F7`

## Conservado (invariantes)

- Roles clínicos (`clinicalRoles`) — alertas críticas/aprobadas siguen con color semántico
- Arquitectura: canvas → isla blanca → contenido; barra píldora; grid 8px
- Tipografía Google Sans Text + Roboto

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 209 tests |
| `npm run db:validate` | OK |

## Riesgos

- Usuarios con preferencias en `epis2-theme-preferences-v1` reciben defaults nuevos al no migrar (storage `v2`).
- Acentos coloridos (`clinicalBlue`, etc.) siguen disponibles en preferencias; solo el chrome visual base es neutro.

## Próximo paso

Validar en navegador: contraste de campos enfocados, legibilidad de chips en Comando, y que alertas clínicas sigan destacando sobre el fondo neutro.
