import type { Components, Theme } from '@mui/material/styles';
import { epis2Shape } from './shape.js';
import { epis2Motion } from './motion.js';

export function buildEpis2Components(motionScheme: 'standard' | 'reduced' = 'standard'): Components<Theme> {
  const transition =
    motionScheme === 'reduced'
      ? 'none'
      : `box-shadow ${epis2Motion.duration.short}ms ${epis2Motion.easing.standard}, background-color ${epis2Motion.duration.short}ms ${epis2Motion.easing.standard}`;

  return {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: epis2Shape.large,
          transition,
        },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: epis2Shape.medium,
          transition,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: epis2Shape.large },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: epis2Shape.extraLarge },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: epis2Shape.full,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: epis2Shape.large },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          transition: motionScheme === 'reduced' ? 'none' : undefined,
        },
      },
    },
  };
}

/** @deprecated Importar buildEpis2Components vía createEpis2Theme */
export const epis2Components = buildEpis2Components();
