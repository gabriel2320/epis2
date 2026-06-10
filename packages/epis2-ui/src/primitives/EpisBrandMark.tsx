import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export type EpisBrandMarkProps = {
  size?: number;
  'data-testid'?: string;
};

/** Marca EPIS2 — letra E azul sobre fondo cuadrado blanco. */
export function EpisBrandMark({
  size = 56,
  'data-testid': testId = 'epis2-brand-mark',
}: EpisBrandMarkProps) {
  const theme = useTheme();

  return (
    <Box
      data-testid={testId}
      aria-hidden
      sx={{
        width: size,
        height: size,
        borderRadius: 0,
        bgcolor: 'background.paper',
        display: 'grid',
        placeItems: 'center',
        boxShadow: 'none',
        border: `1px solid ${theme.epis2?.visual?.cardBorder ?? theme.palette.divider}`,
      }}
    >
      <Typography
        component="span"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 800,
          fontSize: size * 0.58,
          lineHeight: 1,
          fontFamily: theme.typography.fontFamily,
          letterSpacing: '-0.04em',
          userSelect: 'none',
        }}
      >
        E
      </Typography>
    </Box>
  );
}
