import type { SxProps, Theme } from '@mui/material/styles';

/** Layout unificado barra comando — censo + ficha + papel (MF-CM-01 Calm). */
export function episUniversalCommandBarLayoutSx(embedded: boolean): SxProps<Theme> {
  return {
    flexShrink: 0,
    minHeight: 32,
    px: { xs: 1.5, md: 2 },
    py: embedded ? 0.75 : 1,
    borderRadius: '16px',
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
