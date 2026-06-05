import type { Components, Theme } from '@mui/material/styles';
import { epis2DisplayFontFamily, epis2MonoFontFamily } from './typography.js';
import { epis2Shape } from './shape.js';
import { epis2Motion } from './motion.js';

export function buildEpis2Components(motionScheme: 'standard' | 'reduced' = 'standard'): Components<Theme> {
  const transition =
    motionScheme === 'reduced'
      ? 'none'
      : `box-shadow ${epis2Motion.duration.short}ms ${epis2Motion.easing.standard}, background-color ${epis2Motion.duration.short}ms ${epis2Motion.easing.standard}, border-color ${epis2Motion.duration.short}ms ${epis2Motion.easing.standard}`;

  return {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        html: {
          scrollBehavior: motionScheme === 'reduced' ? 'auto' : 'smooth',
        },
        body: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': {
          backgroundColor: theme.palette.action.selected,
          color: theme.palette.text.primary,
        },
        'pre, code, kbd, samp': {
          fontFamily: epis2MonoFontFamily,
          fontVariantNumeric: 'tabular-nums',
        },
      }),
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 500,
          fontFamily: epis2DisplayFontFamily,
          borderRadius: epis2Shape.squircle,
          minHeight: 40,
          transition,
          '&.MuiButton-containedPrimary': {
            backgroundImage: 'none',
            backgroundColor: theme.palette.primary.main,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: 'none',
            },
          },
          '&.MuiButton-sizeLarge': {
            minHeight: 48,
            px: 3,
          },
          whiteSpace: 'normal',
          textAlign: 'center',
          lineHeight: 1.45,
        }),
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: epis2Shape.large,
          transition: 'none',
          minHeight: 48,
          backgroundColor: theme.palette.background.paper,
          '&.Mui-focused': {
            boxShadow: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '2px',
            borderColor: theme.palette.text.primary,
          },
          '& legend': {
            transition: 'none',
          },
        }),
        input: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
          padding: '10px 14px',
        },
        notchedOutline: ({ theme }) => ({
          borderWidth: '2px',
          borderColor: theme.epis2?.visual?.powerBarBorder ?? theme.palette.divider,
          transition: 'none',
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
          transition: 'none',
        },
        shrink: {
          transform: 'translate(14px, -9px) scale(0.85)',
          transition: 'none',
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          lineHeight: 1.55,
          minHeight: '1.375rem',
          marginTop: 6,
          marginLeft: 0,
          marginRight: 0,
          px: 0.5,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        message: {
          fontSize: '0.875rem',
          lineHeight: 1.55,
          px: 0.5,
          py: 0.25,
        },
      },
    },
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
          fontWeight: 600,
          lineHeight: 1.45,
          mb: 0.5,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.875rem',
          lineHeight: 1.55,
        },
        secondary: {
          fontSize: '0.875rem',
          lineHeight: 1.55,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'none',
        },
        input: {
          transition: 'none',
        },
        inputMultiline: {
          transition: 'none',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          transition: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        rounded: { borderRadius: epis2Shape.island },
        root: {
          backgroundImage: 'none',
          border: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: epis2Shape.extraLarge,
          border: 'none',
          boxShadow: theme.epis2?.visual?.cardElevation ?? 'none',
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 500,
          fontFamily: epis2DisplayFontFamily,
          borderRadius: epis2Shape.pill,
          height: 'auto',
          minHeight: 36,
          maxWidth: '100%',
          fontSize: '0.875rem',
          '& .MuiChip-label': {
            px: 1.5,
            py: 0.75,
            whiteSpace: 'normal',
            overflow: 'visible',
            textOverflow: 'clip',
            lineHeight: 1.45,
          },
          '&.MuiChip-filled': {
            bgcolor: theme.palette.action.hover,
            color: theme.palette.text.primary,
          },
        }),
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: epis2Shape.island,
          bgcolor: theme.palette.background.paper,
          border: 'none',
          boxShadow: 'none',
          backgroundImage: 'none',
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          transition: motionScheme === 'reduced' ? 'none' : undefined,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'none',
          backgroundImage: 'none',
        },
      },
    },
  };
}

/** @deprecated Importar buildEpis2Components vía createEpis2Theme */
export const epis2Components = buildEpis2Components();
