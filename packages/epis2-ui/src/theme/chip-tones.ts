import type { SxProps, Theme } from '@mui/material/styles';
import type { IntentChipTone, RoleChipTone } from '../command/intent-visual.js';

/** Píldora monocromática — diferenciación por icono, no por color. */
function monoChip(theme: Theme, emphasis: 'soft' | 'strong' = 'soft'): SxProps<Theme> {
  if (emphasis === 'strong') {
    return {
      bgcolor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
      '&:hover': {
        bgcolor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
      },
    };
  }
  return {
    bgcolor: theme.palette.action.hover,
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    '&:hover': {
      bgcolor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
    },
  };
}

/** Superficie pastel del icono en tarjetas de sugerencia (Mockup A). */
export function intentIconSurfaceSx(tone: IntentChipTone, theme: Theme): SxProps<Theme> {
  const clinical = theme.epis2?.clinical;
  const map: Record<IntentChipTone, SxProps<Theme>> = {
    ai: {
      bgcolor: theme.palette.primary.light,
      color: theme.palette.primary.dark,
    },
    search: {
      bgcolor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
    evolution: {
      bgcolor: theme.palette.primary.light,
      color: theme.palette.primary.dark,
    },
    discharge: {
      bgcolor: clinical?.approved.container ?? theme.palette.info.light,
      color: clinical?.approved.onContainer ?? theme.palette.info.dark,
    },
    rx: {
      bgcolor: clinical?.warning.container ?? theme.palette.warning.light,
      color: clinical?.warning.onContainer ?? theme.palette.warning.dark,
    },
    labs: {
      bgcolor: clinical?.approved.container ?? theme.palette.success.light,
      color: clinical?.approved.onContainer ?? theme.palette.success.dark,
    },
    imaging: {
      bgcolor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
    nursing: {
      bgcolor: theme.palette.action.hover,
      color: theme.palette.text.primary,
    },
    pharmacy: {
      bgcolor: clinical?.warning.container ?? theme.palette.warning.light,
      color: clinical?.warning.onContainer ?? theme.palette.warning.dark,
    },
    dashboard: {
      bgcolor: theme.palette.action.selected,
      color: theme.palette.text.primary,
    },
  };
  return map[tone];
}

export function intentChipToneSx(tone: IntentChipTone, theme: Theme): SxProps<Theme> {
  const map: Record<IntentChipTone, SxProps<Theme>> = {
    ai: monoChip(theme),
    search: monoChip(theme),
    evolution: monoChip(theme),
    discharge: monoChip(theme),
    rx: monoChip(theme),
    labs: monoChip(theme),
    imaging: monoChip(theme),
    nursing: monoChip(theme),
    pharmacy: monoChip(theme),
    dashboard: monoChip(theme, 'strong'),
  };
  return map[tone];
}

export function roleChipToneSx(tone: RoleChipTone, theme: Theme): SxProps<Theme> {
  const map: Record<RoleChipTone, SxProps<Theme>> = {
    physician: monoChip(theme, 'strong'),
    nurse: monoChip(theme),
    paramedic: monoChip(theme, 'strong'),
    kinesiologist: monoChip(theme),
    pharmacist: monoChip(theme),
    admin: monoChip(theme),
    auditor: {
      bgcolor: clinicalWarningContainer(theme),
      color: theme.epis2?.clinical.warning.onContainer ?? '#5C3D00',
      borderColor: theme.palette.warning.main,
    },
    default: {
      bgcolor: theme.palette.background.paper,
      color: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
    },
  };
  return map[tone];
}

function clinicalWarningContainer(theme: Theme) {
  return theme.epis2?.clinical.warning.container ?? '#FFF4CE';
}
