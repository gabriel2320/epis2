import type { ReactNode } from 'react';
import { Box, cicaTokens } from '@epis2/epis2-ui';

export type CicaSummaryGridProps = {
  children: ReactNode;
  testId?: string;
};

/**
 * Envoltura de bloques de resumen CICA — 1 col móvil, 2 col máx en md+.
 * Reestructura el Stack interno de ClassicChartSummaryPanel sin modificar su código.
 */
export function CicaSummaryGrid({ children, testId = 'cica-summary-grid' }: CicaSummaryGridProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        width: '100%',
        minWidth: 0,
        '& > [data-cica-composition="classic"]': {
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: `${cicaTokens.unit}px`,
          alignItems: 'start',
          '& > *': { minWidth: 0 },
        },
      }}
    >
      {children}
    </Box>
  );
}
