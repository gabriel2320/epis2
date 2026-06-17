import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { clinicalLayoutTokens } from './clinicalLayoutTokens.js';

export type ClinicalFieldGridColumns = 1 | 2 | 3 | 4 | 12;

export type ClinicalFieldGridProps = {
  columns?: ClinicalFieldGridColumns;
  children: ReactNode;
  testId?: string;
};

const GRID_TEMPLATES = {
  1: '1fr',
  2: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
  3: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
  4: {
    xs: '1fr',
    sm: 'repeat(2, minmax(0, 1fr))',
    lg: 'repeat(4, minmax(0, 1fr))',
  },
  12: 'repeat(12, minmax(0, 1fr))',
} as const satisfies Record<ClinicalFieldGridColumns, string | object>;

/** Grilla de campos clínicos — columnas simétricas por breakpoint. */
export function ClinicalFieldGrid({
  columns = 2,
  children,
  testId = 'clinical-field-grid',
}: ClinicalFieldGridProps) {
  return (
    <Box
      data-testid={testId}
      data-clinical-columns={columns}
      sx={{
        display: 'grid',
        gridTemplateColumns: GRID_TEMPLATES[columns],
        gap: clinicalLayoutTokens.density.calm.fieldGap,
        alignItems: 'start',
        minWidth: 0,
        width: '100%',
      }}
      className="epis2-clinical-field-grid"
    >
      {children}
    </Box>
  );
}

export type ClinicalFieldCellProps = {
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  children: ReactNode;
  testId?: string;
};

/** Celda en grilla 12 columnas. */
export function ClinicalFieldCell({ span = 6, children, testId }: ClinicalFieldCellProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        gridColumn: { xs: '1 / -1', md: `span ${Math.min(span, 12)}` },
        minWidth: 0,
      }}
      className="epis2-clinical-field-cell"
    >
      {children}
    </Box>
  );
}
