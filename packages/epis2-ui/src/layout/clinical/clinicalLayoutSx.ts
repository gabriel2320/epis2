import type { SxProps, Theme } from '@mui/material/styles';
import { cicaMaxContentWidth, cicaShellPaddingXSx } from '../../cica/cicaResponsive.js';
import type { CicaLayoutProfile } from '../../cica/cicaTokens.js';
import type { ClinicalLayoutProfile } from './clinicalLayoutEngine.js';
import { resolveLayoutProfile } from './clinicalLayoutEngine.js';
import { clinicalLayoutTokens } from './clinicalLayoutTokens.js';

function isCicaLayoutProfile(profile: string): profile is CicaLayoutProfile {
  return profile in cicaMaxContentWidth;
}

function clinicalProfileMaxWidth(profile: ClinicalLayoutProfile): number {
  if (isCicaLayoutProfile(profile)) {
    return cicaMaxContentWidth[profile];
  }
  return resolveLayoutProfile(profile).maxWidth;
}

export function clinicalScreenSx(profile: ClinicalLayoutProfile): SxProps<Theme> {
  return {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    overflow: 'hidden',
    overflowX: 'hidden',
    maxWidth: clinicalProfileMaxWidth(profile),
    width: '100%',
    mx: 'auto',
    px: cicaShellPaddingXSx,
  };
}

export function clinicalHeaderSx(): SxProps<Theme> {
  return {
    py: clinicalLayoutTokens.spacing.md,
    flexShrink: 0,
  };
}

export function clinicalContentSx(profile: ClinicalLayoutProfile): SxProps<Theme> {
  const density = clinicalLayoutTokens.density.calm;
  const cicaBounded = isCicaLayoutProfile(profile);
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
    maxWidth: cicaBounded
      ? cicaMaxContentWidth[profile]
      : clinicalLayoutTokens.page.maxReadableWidth,
    width: '100%',
    mx: cicaBounded ? 'auto' : undefined,
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
