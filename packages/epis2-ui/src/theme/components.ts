import type { Components, Theme } from '@mui/material/styles';
import { epis2M3TouchTargetMinPx } from './m3-layout-tokens.js';
import { epis2DisplayFontFamily, epis2MonoFontFamily } from './typography.js';
import { epis2Shape, epis2ShapeProfiles } from './shape.js';
import { epis2Motion, epis2StateLayer } from './motion.js';

export function buildEpis2Components(
  motionScheme: 'standard' | 'reduced' = 'standard',
  contrast: 'standard' | 'high' = 'standard',
): Components<Theme> {
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
        // Indicador de foco universal (WCAG 2.4.7) — siempre visible; reforzado en alto contraste.
        '*:focus-visible': {
          outline: `${contrast === 'high' ? 3 : 2}px solid ${theme.palette.text.primary}`,
          outlineOffset: '2px',
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
        root: ({ theme }) => {
          const containedColors = [
            'primary',
            'secondary',
            'error',
            'warning',
            'info',
            'success',
          ] as const;
          const containedContrastRules = Object.fromEntries(
            containedColors
              .filter((color) => theme.palette[color]?.main && theme.palette[color]?.contrastText)
              .map((color) => [
                `&.MuiButton-contained${color.charAt(0).toUpperCase()}${color.slice(1)}`,
                {
                  backgroundImage: 'none',
                  backgroundColor: theme.palette[color].main,
                  color: theme.palette[color].contrastText,
                  boxShadow: 'none',
                  // State layer M3: contrastText 8% sobre el contenedor (no palette.dark,
                  // que en MTB mapea a onPrimaryContainer — rol sin semántica de interacción).
                  '&:hover': {
                    backgroundColor: epis2StateLayer(
                      theme.palette[color].main,
                      theme.palette[color].contrastText,
                      'hover',
                    ),
                    color: theme.palette[color].contrastText,
                    boxShadow: 'none',
                  },
                  '&:active': {
                    backgroundColor: epis2StateLayer(
                      theme.palette[color].main,
                      theme.palette[color].contrastText,
                      'pressed',
                    ),
                  },
                },
              ]),
          );

          return {
            textTransform: 'none',
            fontWeight: 500,
            fontFamily: epis2DisplayFontFamily,
            borderRadius: epis2Shape.squircle,
            minHeight: epis2M3TouchTargetMinPx,
            transition,
            ...containedContrastRules,
            '&.MuiButton-sizeLarge': {
              minHeight: 48,
              px: 3,
            },
            whiteSpace: 'normal',
            textAlign: 'center',
            lineHeight: 1.45,
          };
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            backgroundColor: epis2StateLayer(
              theme.palette.primary.main,
              theme.palette.primary.contrastText,
            ),
            color: theme.palette.primary.contrastText,
          },
          '&.MuiFab-secondary': {
            color: theme.palette.secondary.contrastText,
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: epis2StateLayer(
                theme.palette.secondary.main,
                theme.palette.secondary.contrastText,
              ),
              color: theme.palette.secondary.contrastText,
            },
          },
          '&.MuiFab-error': {
            color: theme.palette.error.contrastText,
            backgroundColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: epis2StateLayer(
                theme.palette.error.main,
                theme.palette.error.contrastText,
              ),
              color: theme.palette.error.contrastText,
            },
          },
        }),
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: epis2ShapeProfiles.traditional.field,
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
          border: `1px solid ${theme.epis2?.visual?.cardBorder ?? theme.palette.divider}`,
          boxShadow: 'none',
          bgcolor: theme.palette.background.paper,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 500,
          fontFamily: epis2DisplayFontFamily,
          borderRadius: epis2ShapeProfiles.traditional.chip,
          height: 'auto',
          minHeight: 36,
          maxWidth: '100%',
          fontSize: '0.875rem',
          // Touch target M3: contenedor visual 36px + hit-area extendida a 48px en chips interactivos.
          '&.MuiChip-clickable': {
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              top: (36 - epis2M3TouchTargetMinPx) / 2,
              bottom: (36 - epis2M3TouchTargetMinPx) / 2,
            },
            // El icono de borrar queda por encima de la hit-area extendida.
            '& .MuiChip-deleteIcon': { position: 'relative', zIndex: 1 },
          },
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
          '&.MuiChip-filledPrimary': {
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
          '&.MuiChip-filledSecondary': {
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
          },
          '&.MuiChip-filledError': {
            bgcolor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          },
          '&.MuiChip-filledWarning': {
            bgcolor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
          },
          '&.MuiChip-filledInfo': {
            bgcolor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
          },
          '&.MuiChip-filledSuccess': {
            bgcolor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
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
