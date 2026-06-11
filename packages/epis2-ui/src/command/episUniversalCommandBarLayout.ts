import type { SxProps, Theme } from '@mui/material/styles';
import { epis2ClinicalShellTokens } from '../theme/chart-modes-tokens.js';
import { epis2Shape } from '../theme/shape.js';

/** Layout unificado barra comando — censo + ficha (radius 8px, borde outlineVariant). */
export function episUniversalCommandBarLayoutSx(embedded: boolean): SxProps<Theme> {
  return {
    flexShrink: 0,
    minHeight: epis2ClinicalShellTokens.actionBarMinHeight,
    px: { xs: 1.5, md: 2 },
    py: embedded ? 0.75 : 1,
    borderRadius: `${epis2Shape.pill}px`,
    border: 1,
    borderColor: 'outlineVariant',
    bgcolor: 'surfaceContainerHigh',
    ...(embedded
      ? {}
      : {
          borderTop: 1,
        }),
  };
}
