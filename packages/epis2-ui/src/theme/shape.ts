/** Escala de forma EPIS2 (px) — grid base 8px; esquinas cuadradas con leve redondeo. */

/** Radio máximo en modo ficha electrónica (traditional EMR) — ver EPIS2_TRADITIONAL_M3_SHAPE_COLOR_PLAN. */
export const epis2TraditionalShapeMaxPx = 10;

export const epis2Shape = {
  /** Sin redondeo — tablas densas y documentos print. */

  none: 0,

  extraSmall: 2,

  small: 4,

  medium: 6,

  large: 8,

  extraLarge: 10,

  /** Isla de contenido principal (lista, formulario, comando). */

  island: 8,

  /** Botones y controles primarios. */

  squircle: 8,

  /** Barra de búsqueda y chips — rectángulo redondeado, no píldora. */

  pill: 8,

  /** Dock flotante / overlays MD3 (16px — extraLarge M3). */

  floating: 16,

  /** @deprecated Usar pill. */

  bar: 8,

  full: 9999,
} as const;

/** Perfiles de forma — traditional EMR vs barra comando (no M3 Expressive 28–48px en ficha). */
export const epis2ShapeProfiles = {
  traditional: {
    chip: epis2Shape.small,
    field: epis2Shape.small,
    island: epis2Shape.island,
    dialog: epis2Shape.extraLarge,
    max: epis2TraditionalShapeMaxPx,
  },
  command: {
    bar: epis2Shape.pill,
    palette: epis2Shape.extraLarge,
  },
} as const;

export type Epis2ShapeKey = keyof typeof epis2Shape;

/** Radio base MUI `shape.borderRadius` — alias de large. */

export const epis2ShapeBorderRadius = epis2Shape.large;
