# Hilo M3-R — State layers, foco, motion, escalera de superficies (R1–R7)

**Fecha:** 2026-06-09 · **Alcance:** plan M3-R de la auditoría Material Design (canvas + revisión m3.material.io) · solo `packages/epis2-ui` (tema + primitivas + tokens de layout) y docs/design — sin dominio clínico, sin SoT

## Qué cambió y por qué

### R1 — State layers M3 (la falta más visible)

M3 define el feedback de interacción como capa del **color del contenido**: hover 8% · focus 10% · pressed 10% · dragged 16%. EPIS2 usaba los defaults MUI (~4%) y `filter: brightness(0.96)`.

| Cambio | Archivo |
|---|---|
| Tokens `epis2StateLayerOpacity` + helper `epis2StateLayer(container, layer, state)` (color-mix — escala igual en claro/oscuro) | `theme/motion.ts` |
| `palette.action.*` alineado (hover/focus/selected/activated) con color derivado de `onSurface` | `theme/create-epis2-theme.ts` |
| `EpisButton` tonal: hover/pressed con state layer del contenido — fuera `filter: brightness` | `primitives/EpisButton.tsx` |

### R2 — Foco visible universal + touch target Chip

- `*:focus-visible` ahora existe **siempre**: 2px estándar / 3px alto contraste (WCAG 2.4.7). Antes solo en HC.
- Chips clicables: contenedor visual 36px + **hit-area extendida a 48px** (pseudo-elemento), icono de borrar por encima. Cumple `epis2M3TouchTargetMinPx` sin engordar la UI densa.

### R3 — Motion según spec

- `easing.emphasized` ahora es real: `cubic-bezier(0.05, 0.7, 0.1, 1)` (M3 emphasized-decelerate) + nuevo `emphasizedAccelerate`. Antes era idéntico a `standard` (token muerto).
- `epis2InteractionDuration` (regla 20) deriva de `epis2Motion` (180–260ms) — se elimina el segundo sistema de duraciones.

### R4 — La escalera de superficies entra a la UI

Hallazgo de auditoría: `theme.epis2.surfaces` solo lo usaban tests. Ahora:

- **Two-pane clínico** (canon §two-pane): panel de acción `surfaceContainerLowest`, panel de consulta `surfaceContainerLow` — jerarquía tonal exacta del canon.
- **Navigation rail**: `surfaceContainerLow` — región de navegación un nivel sobre el contenido, sin sombras.

### R5 — Roles tone-based completos en runtime

`M3SurfaceRoles` expone ahora `surfaceDim`, `surfaceBright`, `inverseSurface`, `inverseOnSurface`, `scrim` (antes morían entre el JSON MTB y el runtime). Cubierto en ambos paths (MTB y legacy). `inversePrimary` queda fuera deliberadamente: depende del acento y no tiene consumidor.

### R7 — Mapeos semánticos corregidos

- `labelMedium → caption` (13px piso clínico + tracking; antes `body2` = 14px cuerpo). `EpisM3Text` fija `variantMapping={{ caption: 'p' }}` para conservar elemento de bloque.
- `bodyMedium → body2` (antes `body1`, duplicado).
- Hover de botones contained/FAB ya no depende de `palette.dark` (que en MTB mapea a `onPrimaryContainer`, rol sin semántica de interacción) — usa state layer `contrastText` 8%.

### R6 — Docs reconciliados

- Canon M3: tabla de forma ahora refleja `shape.ts` real con la decisión «escala comprimida clínica» declarada · compresión tipográfica (10/15 roles) declarada como decisión con regla de extensión · sección **Estados** nueva con los tokens de state layer · easing emphasized actualizado.
- `shape.ts`: añadido `none: 0` (tablas densas / print).
- `EPIS2_THEME_SPEC.md`: banner **HISTÓRICO** (describía el baseline MUI-01).

## Decisiones de diseño

1. **color-mix sobre pares hardcodeados** — el state layer se calcula del par contenedor/contenido activo; ningún tema necesita tokens hover propios.
2. **No adoptar M3 Expressive** — coherente con el canon anti-expresivo clínico; solo se tomó el easing emphasized correcto (que es M3 base, no Expressive).
3. **Escala de forma comprimida se mantiene** — cambiarla a los valores de referencia M3 alteraría toda la app sin beneficio clínico; se declara como decisión en el canon (el código es la verdad).
4. **Hit-area invisible en chips** — cumplir 48dp sin crecer el contenedor visual de 36px protege la densidad de las bandejas.

## Gates

| Gate | Estado |
|---|---|
| `vitest packages/epis2-ui` | ✓ 106/106 (3 tests nuevos: state layers, foco 2px/3px, roles tone-based) |
| `npm run theme:validate` | ✓ 8 pasos (contraste, roles, snapshots, parity) |
| `npm run check` | ✓ |
| `npm run test` (suite completa) | ✓ ver cierre |

## Riesgos / pendiente humano

- **Cambios visuales sutiles** esperados: hover más perceptible en botones/chips, anillo de foco con teclado en modo estándar, rail y panel de consulta un nivel tonal distinto, meta `labelMedium` a 13px. Revisar con `npm run dev` (claro/oscuro) o `quality:m3-visual-pass` (V1–V6) antes del próximo release demo.
- `color-mix(in srgb, …)` requiere navegadores 2023+ — dentro del baseline EPIS2 (Chromium reciente); jsdom no lo evalúa (tests no afectados).
- M3-R quedó completo salvo consumo más amplio de la escalera (paneles dashboard) — incremental cuando se toque cada superficie.

## Próximo paso exacto

`quality:m3-visual-pass` + signoff visual humano de los cambios de interacción · luego F3 (config) + PEND-004 según plan de pendientes.
