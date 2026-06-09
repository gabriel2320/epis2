import Typography, { type TypographyProps } from '@mui/material/Typography';
import { epis2M3TypographyVariants, type Epis2M3TypographyRole } from '../theme/typography.js';

export type EpisM3TextProps = TypographyProps & {
  role: Epis2M3TypographyRole;
};

/** Texto con rol tipográfico M3 (display, headline, title, body, label). */
export function EpisM3Text({ role, variant, ...rest }: EpisM3TextProps) {
  return (
    <Typography
      variant={variant ?? epis2M3TypographyVariants[role]}
      // labelMedium mapea a caption (13px piso clínico); se mantiene elemento de bloque.
      variantMapping={{ caption: 'p' }}
      {...rest}
    />
  );
}
