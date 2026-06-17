import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { cicaResponsiveGrid } from './cicaResponsive.js';
import { cicaTokens } from './cicaTokens.js';

export type CicaResponsiveGridColumns = 1 | 2 | 12;

export type CicaResponsiveGridProps = {
  /** Override fijo de columnas (sin breakpoints). */
  columns?: CicaResponsiveGridColumns;
  /** Modo auto-fit: repeat(auto-fit, minmax(minChildWidth, 1fr)). */
  minChildWidth?: number;
  children: ReactNode;
  testId?: string;
  sx?: SxProps<Theme>;
};

function resolveTemplateColumns(
  columns: CicaResponsiveGridColumns | undefined,
  minChildWidth: number | undefined,
): string | Record<string, string> {
  if (columns == null && minChildWidth != null) {
    return `repeat(auto-fit, minmax(${minChildWidth}px, 1fr))`;
  }
  if (columns === 1) return '1fr';
  if (columns === 2) return cicaResponsiveGrid.templateColumns.sm;
  if (columns === 12) return cicaResponsiveGrid.templateColumns.md;
  return cicaResponsiveGrid.templateColumns;
}

/** Grilla responsiva CICA — 1 col xs · 2 col sm · 12 col md+. */
export function CicaResponsiveGrid({
  columns,
  minChildWidth,
  children,
  testId = 'cica-responsive-grid',
  sx,
}: CicaResponsiveGridProps) {
  const template = resolveTemplateColumns(columns, minChildWidth);

  return (
    <Box
      data-testid={testId}
      data-cica-grid-columns={columns ?? 'responsive'}
      sx={[
        {
          display: 'grid',
          gridTemplateColumns: template,
          gap: `${cicaTokens.unit}px`,
          alignItems: 'start',
          minWidth: 0,
          width: '100%',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      className="cica-responsive-grid"
    >
      {children}
    </Box>
  );
}

export type CicaGridCellProps = {
  /** Span en grilla 12 columnas (md+). xs/sm ocupan ancho completo. */
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  children: ReactNode;
  testId?: string;
};

/** Celda en grilla CICA 12 columnas. */
export function CicaGridCell({ span = 6, children, testId }: CicaGridCellProps) {
  return (
    <Box
      data-testid={testId}
      sx={{
        gridColumn: { xs: '1 / -1', sm: '1 / -1', md: `span ${Math.min(span, 12)}` },
        minWidth: 0,
      }}
      className="cica-grid-cell"
    >
      {children}
    </Box>
  );
}
