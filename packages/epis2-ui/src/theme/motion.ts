/** Tokens de movimiento M3 EPIS2. */
export const epis2Motion = {
  duration: {
    instant: 80,
    short: 120,
    medium: 180,
    long: 260,
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    /** M3 emphasized-decelerate — entradas y expansiones con énfasis. */
    emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    /** M3 emphasized-accelerate — salidas con énfasis. */
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

/** Opacidades de state layer M3 (states spec): feedback con el color del contenido. */
export const epis2StateLayerOpacity = {
  hover: 0.08,
  focus: 0.1,
  pressed: 0.1,
  dragged: 0.16,
} as const;

/**
 * State layer M3 como color CSS — mezcla `layer` sobre `container` con la
 * opacidad del estado (color-mix evita pares hardcodeados por tema).
 */
export function epis2StateLayer(
  container: string,
  layer: string,
  state: keyof typeof epis2StateLayerOpacity = 'hover',
): string {
  const pct = Math.round(epis2StateLayerOpacity[state] * 100);
  return `color-mix(in srgb, ${container} ${100 - pct}%, ${layer} ${pct}%)`;
}

export type Epis2MotionScheme = 'standard' | 'reduced';

export function motionTransition(
  properties: string | string[],
  scheme: Epis2MotionScheme = 'standard',
): string {
  const props = Array.isArray(properties) ? properties.join(', ') : properties;
  if (scheme === 'reduced') {
    return `${props} 0ms linear`;
  }
  return `${props} ${epis2Motion.duration.medium}ms ${epis2Motion.easing.standard}`;
}

/** Respeta prefers-reduced-motion en runtime (cliente). */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
