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
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

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
