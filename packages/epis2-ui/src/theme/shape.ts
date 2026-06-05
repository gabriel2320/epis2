/** Escala de forma M3 EPIS2 (px). */
export const epis2Shape = {
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 24,
  full: 999,
} as const;

export type Epis2ShapeKey = keyof typeof epis2Shape;

/** Radio base MUI `shape.borderRadius` — alias de large. */
export const epis2ShapeBorderRadius = epis2Shape.large;
