import MuiButton, { type ButtonProps } from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import type { ElementType } from 'react';
import { epis2StateLayer } from '../theme/motion.js';

export type EpisButtonAppearance = 'filled' | 'tonal' | 'text' | 'outlined';

export type EpisButtonProps<C extends ElementType = 'button'> = ButtonProps<
  C,
  { component?: C }
> & {
  /** Apariencia M3 — prioridad sobre `variant` legacy si no se pasa variant. */
  appearance?: EpisButtonAppearance;
};

function resolveAppearance(
  appearance: EpisButtonAppearance,
): Pick<ButtonProps, 'variant' | 'color'> {
  switch (appearance) {
    case 'filled':
      return { variant: 'contained', color: 'primary' };
    case 'tonal':
      return { variant: 'contained', color: 'secondary' };
    case 'text':
      return { variant: 'text', color: 'primary' };
    case 'outlined':
      return { variant: 'outlined', color: 'primary' };
  }
}

/** Botón EPIS2 — patrones M3 filled / tonal / text / outlined. */
export function EpisButton<C extends ElementType = 'button'>({
  appearance,
  variant,
  color,
  sx,
  ...rest
}: EpisButtonProps<C>) {
  const theme = useTheme();
  const mapped = appearance ? resolveAppearance(appearance) : null;
  const resolvedVariant = variant ?? mapped?.variant ?? 'contained';
  const resolvedColor = color ?? mapped?.color ?? 'primary';

  // Tonal M3: container + state layer del contenido (8% hover / 10% pressed) —
  // escala igual en claro/oscuro, a diferencia de filter: brightness.
  const tonalSx =
    appearance === 'tonal'
      ? {
          bgcolor: theme.palette.primary.light,
          color: theme.palette.primary.dark,
          '&:hover': {
            bgcolor: epis2StateLayer(
              theme.palette.primary.light,
              theme.palette.primary.dark,
              'hover',
            ),
            color: theme.palette.primary.dark,
          },
          '&:active': {
            bgcolor: epis2StateLayer(
              theme.palette.primary.light,
              theme.palette.primary.dark,
              'pressed',
            ),
          },
        }
      : undefined;

  return (
    <MuiButton
      variant={resolvedVariant}
      color={resolvedColor}
      {...(tonalSx || sx ? { sx: tonalSx ? { ...tonalSx, ...(sx as object) } : sx } : {})}
      {...rest}
    />
  );
}
