import type { SxProps, Theme } from '@mui/material/styles';

/** Pestaña clínica tabulada — subrayado calm, sin pills navy. */
export function epis2ClassicChartTabSx(active = false): SxProps<Theme> {
  return {
    position: 'relative',
    px: { xs: 1.25, md: 2 },
    py: 1.25,
    minHeight: 40,
    fontSize: '0.8125rem',
    fontWeight: active ? 600 : 500,
    lineHeight: 1.25,
    letterSpacing: '0.01em',
    color: active ? 'primary.main' : 'text.secondary',
    bgcolor: 'transparent',
    border: 'none',
    borderBottom: '2px solid',
    borderBottomColor: active ? 'primary.main' : 'transparent',
    borderRadius: 0,
    mb: '-1px',
    transition: 'color 120ms ease, border-color 120ms ease',
    '&:hover': {
      color: 'text.primary',
      bgcolor: 'action.hover',
    },
  };
}

/** Contenedor tabs clínicos — franja sobria sobre canvas calm. */
export function epis2ClassicChartTabsNavSx(): SxProps<Theme> {
  return {
    display: 'flex',
    gap: 0.25,
    px: { xs: 1, md: 2 },
    py: 0,
    borderBottom: 1,
    borderColor: 'divider',
    flexShrink: 0,
    overflowX: 'auto',
    bgcolor: 'background.paper',
  };
}

/** Bloque sección clínica plano — sin card anidada (ficha EMR clásica). */
export function epis2ClassicClinicalBlockSx(): SxProps<Theme> {
  return {
    py: 2,
    borderBottom: 1,
    borderColor: 'divider',
    '&:last-child': {
      borderBottom: 0,
      pb: 0,
    },
  };
}

/** Tabla clínica legible — bordes suaves, sin wireframe. */
export function epis2ClassicClinicalTableSx(): SxProps<Theme> {
  return {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.8125rem',
    lineHeight: 1.45,
    '& td, & th': {
      borderBottom: 1,
      borderColor: 'divider',
      py: 1,
      px: 1.25,
      verticalAlign: 'top',
    },
    '& th': {
      width: '30%',
      maxWidth: 220,
      textAlign: 'left',
      color: 'text.secondary',
      fontWeight: 500,
      bgcolor: 'action.hover',
    },
    '& tbody tr:last-child td, & tbody tr:last-child th': {
      borderBottom: 0,
    },
    '& tbody tr:hover td, & tbody tr:hover th': {
      bgcolor: 'action.hover',
    },
  };
}

/** Resumen clínico — bloque plano sin borde de card. */
export function epis2ClassicSummaryBlockSx(): SxProps<Theme> {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    py: 1.75,
    px: 0,
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: 'transparent',
    boxShadow: 'none',
    borderRadius: 0,
    minHeight: 0,
  };
}

/** Área central ficha clásica — canvas calm + scroll único. */
export function epis2ClassicChartContentSx(): SxProps<Theme> {
  return {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
    overflow: 'auto',
    overflowX: 'hidden',
    px: { xs: 2, md: 3 },
    py: 2,
    bgcolor: 'background.default',
  };
}
