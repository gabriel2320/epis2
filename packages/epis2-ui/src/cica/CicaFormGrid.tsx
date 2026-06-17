import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { cicaTokens } from './cicaTokens.js';

export type CicaFormGridProps = {
  /** Prosa clínica — siempre 1 columna (móvil y tablet). */
  prose?: boolean;
  children: ReactNode;
  testId?: string;
  sx?: SxProps<Theme>;
};

/**
 * Envoltura de formularios CICA — ancho completo móvil, 2 col campos cortos tablet+.
 * Ajusta grids internos de EpisClinicalFormRhf vía selector descendiente.
 */
export function CicaFormGrid({
  prose = false,
  children,
  testId = 'cica-form-grid',
  sx,
}: CicaFormGridProps) {
  const sectionGridSx = prose
    ? {
        gridTemplateColumns: '1fr',
        '& [data-testid^="epis2-form-field-cell"]': { gridColumn: '1 / -1' },
      }
    : {
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(12, minmax(0, 1fr))',
        },
      };

  return (
    <Box
      data-testid={testId}
      data-cica-form-grid={prose ? 'prose' : 'fields'}
      sx={[
        {
          width: '100%',
          minWidth: 0,
          '& [data-testid^="epis2-form-section-grid"]': {
            display: 'grid',
            ...sectionGridSx,
            gap: `${cicaTokens.unit}px`,
            columnGap: `${cicaTokens.unit}px`,
            rowGap: `${cicaTokens.unit * 2}px`,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      className="cica-form-grid"
    >
      {children}
    </Box>
  );
}
