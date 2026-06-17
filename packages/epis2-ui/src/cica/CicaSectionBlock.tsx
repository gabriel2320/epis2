import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { CicaEpis2gBlock } from './cicaEpis2gScreenStructure.js';

const ACCENT: Record<NonNullable<CicaEpis2gBlock['accent']>, string> = {
  sky: '#0ea5e9',
  indigo: '#6366f1',
  teal: '#14b8a6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  emerald: '#10b981',
  slate: '#64748b',
};

export type CicaSectionBlockProps = CicaEpis2gBlock & {
  children: ReactNode;
  testId?: string;
};

/** Bloque clínico epis2g — tarjeta con borde superior de acento. */
export function CicaSectionBlock({
  id,
  title,
  accent = 'slate',
  span = 12,
  children,
  testId,
}: CicaSectionBlockProps) {
  return (
    <Box
      data-testid={testId ?? `cica-block-${id}`}
      data-cica-block-id={id}
      sx={{
        gridColumn: { xs: '1 / -1', lg: `span ${Math.min(span, 12)}` },
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderTopWidth: 3,
        borderTopColor: ACCENT[accent],
        borderRadius: 2,
        p: 2.5,
        boxShadow: 1,
        minWidth: 0,
      }}
    >
      <Typography
        variant="caption"
        component="h3"
        sx={{
          display: 'block',
          mb: 1.5,
          fontWeight: 700,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}
