import type { SxProps, Theme } from '@mui/material/styles';
import type { ClinicalLayoutProfile } from './clinicalLayoutEngine.js';
import { resolveLayoutProfile } from './clinicalLayoutEngine.js';
import { clinicalLayoutTokens } from './clinicalLayoutTokens.js';

export function clinicalScreenSx(profile: ClinicalLayoutProfile): SxProps<Theme> {
  const config = resolveLayoutProfile(profile);
  return {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    overflow: 'hidden',
    maxWidth: config.maxWidth,
    width: '100%',
    mx: 'auto',
    px: { xs: clinicalLayoutTokens.spacing.sm, md: clinicalLayoutTokens.spacing.lg },
  };
}

export function clinicalHeaderSx(): SxProps<Theme> {
  return {
    py: clinicalLayoutTokens.spacing.md,
    flexShrink: 0,
  };
}

export function clinicalContentSx(profile: ClinicalLayoutProfile): SxProps<Theme> {
  const config = resolveLayoutProfile(profile);
  const density = clinicalLayoutTokens.density.calm;
  return {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    overflow: 'auto',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: density.sectionGap,
    pb: clinicalLayoutTokens.spacing.lg,
    maxWidth: profile === 'paper-mode' ? config.maxWidth : clinicalLayoutTokens.page.maxReadableWidth,
    width: '100%',
    mx: profile === 'paper-mode' ? 'auto' : undefined,
  };
}

export function clinicalSectionSx(): SxProps<Theme> {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: clinicalLayoutTokens.density.calm.fieldGap,
    minWidth: 0,
  };
}

export function clinicalActionBarSx(
  position: 'bottom-right' | 'sticky-bottom' | 'top-toolbar',
): SxProps<Theme> {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: clinicalLayoutTokens.spacing.sm,
    px: clinicalLayoutTokens.spacing.lg,
    py: clinicalLayoutTokens.spacing.md,
    borderTop: position !== 'top-toolbar' ? 1 : 0,
    borderBottom: position === 'top-toolbar' ? 1 : 0,
    borderColor: 'divider',
    bgcolor: 'background.paper',
    flexShrink: 0,
    ...(position === 'sticky-bottom'
      ? {
          position: 'sticky',
          bottom: 0,
          zIndex: 1,
        }
      : {}),
  };
}
