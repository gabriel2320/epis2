/** Escala de forma EPIS2 (px) — grid base 8px; esquinas cuadradas con leve redondeo. */
export const epis2Shape = {
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
  /** @deprecated Usar pill. */
  bar: 8,
  full: 9999,
} as const;

export type Epis2ShapeKey = keyof typeof epis2Shape;

/** Radio base MUI `shape.borderRadius` — alias de large. */
export const epis2ShapeBorderRadius = epis2Shape.large;
