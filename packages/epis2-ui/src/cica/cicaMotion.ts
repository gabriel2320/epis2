import type { SxProps, Theme } from '@mui/material/styles';
import { epis2Motion, type Epis2MotionScheme } from '../theme/motion.js';

/** CICA Clean Room — tokens de movimiento (sobrios, clínicos). */
export const cicaMotion = {
  duration: {
    /** Entrada de pantalla / ruta. */
    screen: epis2Motion.duration.medium,
    /** Indicadores de tab y chrome. */
    tab: epis2Motion.duration.short,
    /** Barra superior al elevarse. */
    chrome: epis2Motion.duration.short,
  },
  easing: {
    enter: epis2Motion.easing.emphasized,
    standard: epis2Motion.easing.standard,
  },
  distance: {
    screenEnterY: 4,
  },
} as const;

/** true solo con preferencia explícita `standard` (combinar con prefersReducedMotion en UI). */
export function shouldAnimate(motionPreference: Epis2MotionScheme): boolean {
  return motionPreference === 'standard';
}

export const cicaFadeInUpKeyframes = {
  '@keyframes cicaFadeInUp': {
    from: {
      opacity: 0,
      transform: `translateY(${cicaMotion.distance.screenEnterY}px)`,
    },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
} as const;

/** sx de entrada fade+slide — desactivado cuando animate=false o prefers-reduced-motion. */
export function cicaFadeInUpSx(animate: boolean): SxProps<Theme> {
  if (!animate) return {};
  return {
    ...cicaFadeInUpKeyframes,
    animation: `cicaFadeInUp ${cicaMotion.duration.screen}ms ${cicaMotion.easing.enter} both`,
    '@media (prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  };
}

/** Cadena transition CSS para propiedades MUI sx. */
export function cicaTransition(
  properties: string | readonly string[],
  animate: boolean,
  durationMs: number = cicaMotion.duration.tab,
): string {
  const props = Array.isArray(properties) ? properties.join(', ') : properties;
  if (!animate) return `${props} 0ms linear`;
  return `${props} ${durationMs}ms ${cicaMotion.easing.standard}`;
}
